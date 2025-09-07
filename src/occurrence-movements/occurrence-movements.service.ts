/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OccurrenceMovement } from './entities/occurrence-movement.entity';
import { CreateOccurrenceMovementDto } from './dto/create-occurrence-movement.dto';
import { OccurrenceMovementResponseDto } from './dto/occurrence-movement-response.dto';
import { User } from '../users/entities/users.entity';
import { GeneralOccurrence } from '../general-occurrences/entities/general-occurrence.entity';
import { UserRole } from '../users/enums/users-role.enum';

@Injectable()
export class OccurrenceMovementsService {
  constructor(
    @InjectRepository(OccurrenceMovement)
    private readonly movementRepository: Repository<OccurrenceMovement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GeneralOccurrence)
    private readonly occurrenceRepository: Repository<GeneralOccurrence>,
  ) {}

  // CRIAR MOVIMENTAÇÃO
  async createMovement(
    createDto: CreateOccurrenceMovementDto,
    performedBy: User
  ): Promise<OccurrenceMovementResponseDto> {
    
    // Validar permissões
    if (!this.canCreateMovement(performedBy)) {
      throw new ForbiddenException('Sem permissão para criar movimentações');
    }

    // Buscar ocorrência
    const occurrence = await this.occurrenceRepository.findOne({
      where: { id: createDto.occurrenceId }
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    // Criar movimentação
    const movement = new OccurrenceMovement();
    Object.assign(movement, createDto);
    movement.performedById = performedBy.id;
    movement.performedBy = performedBy;

    // Calcular prazos se for a primeira movimentação
    if (!createDto.deadline) {
      movement.deadline = this.calculateInitialDeadline(occurrence.createdAt);
      movement.originalDeadline = movement.deadline;
    }

    // Atualizar flags de prazo
    this.updateDeadlineFlags(movement);

    const saved = await this.movementRepository.save(movement);
    return this.mapToResponseDto(saved);
  }

  // BUSCAR MOVIMENTAÇÕES DE UMA OCORRÊNCIA
  async getOccurrenceMovements(
    occurrenceId: string,
    user: User
  ): Promise<OccurrenceMovementResponseDto[]> {
    
    if (!(await this.canAccessOccurrenceMovements(occurrenceId, user))) {
      throw new ForbiddenException('Sem permissão para acessar movimentações desta ocorrência');
    }

    const movements = await this.movementRepository.find({
      where: { occurrenceId },
      relations: ['performedBy'],
      order: { performedAt: 'ASC' }
    });

    return movements.map(movement => this.mapToResponseDto(movement));
  }

// LISTAR TODAS AS OCORRÊNCIAS COM STATUS DE PRAZO (PAGINADO)
async getOccurrencesWithDeadlineStatus(
  user: User,
  paginationOptions?: {
    page: number;
    limit: number;
    search?: string;
    onlyMyOccurrences?: boolean;
    
  }
) {
  // Valores padrão para paginação
  const page = paginationOptions?.page || 1;
  const limit = paginationOptions?.limit || 10;
  const search = paginationOptions?.search;
  const onlyMyOccurrences = paginationOptions?.onlyMyOccurrences || false;

  const qb = this.occurrenceRepository.createQueryBuilder('occurrence')
    .leftJoinAndSelect('occurrence.forensicService', 'forensicService')
    .leftJoinAndSelect('occurrence.responsibleExpert', 'expert')
    .where('occurrence.deletedAt IS NULL');

  // Aplicar filtro "Minhas Ocorrências" se solicitado
  if (onlyMyOccurrences && user.role === UserRole.PERITO_OFICIAL) {
    qb.andWhere('expert.id = :userId', { userId: user.id });
  }

  // Aplicar filtros de busca se fornecido
  if (search && search.trim()) {
    qb.andWhere(
      '(occurrence.caseNumber ILIKE :search OR ' +
      'forensicService.name ILIKE :search OR ' +
      'expert.name ILIKE :search)',
      { search: `%${search.trim()}%` }
    );
  }

  // Aplicar filtros de acesso do usuário (apenas se não for "minhas ocorrências")
  if (!onlyMyOccurrences) {
    await this.applyUserAccessFilters(qb, user);
  }

  // Calcular total antes da paginação
  const total = await qb.getCount();

  // Aplicar paginação
  const offset = (page - 1) * limit;
  qb.skip(offset).take(limit);

  // Ordenar por data de criação (mais recentes primeiro)
  qb.orderBy('occurrence.createdAt', 'DESC');

  const occurrences = await qb.getMany();
  
  // Mapear dados com status de prazo
  // Mapear dados com status de prazo
const data = occurrences.map(occurrence => ({
  ...occurrence,
  currentDeadline: this.calculateInitialDeadline(occurrence.createdAt),
  isOverdue: this.isOverdue(occurrence.createdAt, occurrence.status),
  isNearDeadline: this.isNearDeadline(occurrence.createdAt, occurrence.status)
  
}));
  // Retornar dados paginados com metadados
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

// Métodos auxiliares
private isOverdue(createdAt: Date, status?: string): boolean {
  // Se ocorrência finalizada, não está em atraso
  if (status === 'CONCLUIDA' || status === 'CANCELADA') {
    return false;
  }
  
  const deadline = this.calculateInitialDeadline(createdAt);
  return new Date() > deadline;
}

private isNearDeadline(createdAt: Date, status?: string): boolean {
  // Se ocorrência finalizada, não tem prazo próximo
  if (status === 'CONCLUIDA' || status === 'CANCELADA') {
    return false;
  }
  
  const deadline = this.calculateInitialDeadline(createdAt);
  const diffDays = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 2 && diffDays >= 0;
}
  // PRORROGAR PRAZO
  async extendDeadline(
    occurrenceId: string,
    extensionDays: number,
    justification: string,
    user: User
  ): Promise<OccurrenceMovementResponseDto> {
    
    // Buscar última movimentação da ocorrência
    const lastMovement = await this.movementRepository.findOne({
      where: { occurrenceId },
      order: { performedAt: 'DESC' }
    });

    if (!lastMovement) {
      throw new NotFoundException('Nenhuma movimentação encontrada para esta ocorrência');
    }

    // Calcular novo prazo
    const currentDeadline = lastMovement.deadline || new Date();
    const newDeadline = new Date(currentDeadline);
    newDeadline.setDate(newDeadline.getDate() + extensionDays);

    // Criar movimentação de prorrogação
    const extensionMovement = await this.createMovement({
      occurrenceId,
      description: `Prazo prorrogado por ${extensionDays} dias. Justificativa: ${justification}`,
      deadline: newDeadline,
      wasExtended: true,
      extensionJustification: justification,
      isSystemGenerated: false
    }, user);

    return extensionMovement;
  }

  // ATUALIZAR FLAGS DE PRAZO AUTOMATICAMENTE (job diário)
  async updateAllDeadlineFlags(): Promise<void> {
  const movements = await this.movementRepository
    .createQueryBuilder('movement')
    .where('movement.deadline IS NOT NULL')
    .getMany();

  for (const movement of movements) {
    this.updateDeadlineFlags(movement);
    await this.movementRepository.save(movement);
  }
}
  // CONFIGURAÇÃO DE PRAZO - Altere aqui se necessário
private readonly USE_BUSINESS_DAYS = true; // true = dias úteis, false = dias corridos

// MÉTODO 1: Dias corridos (10 dias incluindo fins de semana)
private calculateInitialDeadlineCalendarDays(createdAt: Date): Date {
  const deadline = new Date(createdAt);
  deadline.setDate(deadline.getDate() + 10);
  return deadline;
}

// MÉTODO 2: Dias úteis (10 dias pulando fins de semana)
private calculateInitialDeadlineBusinessDays(createdAt: Date): Date {
  const deadline = new Date(createdAt);
  let daysAdded = 0;
  
  while (daysAdded < 10) {
    deadline.setDate(deadline.getDate() + 1);
    // Pular fins de semana (0 = domingo, 6 = sábado)
    if (deadline.getDay() !== 0 && deadline.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  return deadline;
}

// MÉTODO PRINCIPAL - Usa a configuração acima
private calculateInitialDeadline(createdAt: Date): Date {
  if (this.USE_BUSINESS_DAYS) {
    return this.calculateInitialDeadlineBusinessDays(createdAt);
  } else {
    return this.calculateInitialDeadlineCalendarDays(createdAt);
  }
}

  private updateDeadlineFlags(movement: OccurrenceMovement): void {
    if (!movement.deadline) return;

    const now = new Date();
    const deadline = new Date(movement.deadline);
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Flag vermelha: prazo esgotado
    movement.isOverdue = diffDays < 0;
    
    // Flag amarela: prazo próximo (2 dias antes)
    movement.isNearDeadline = diffDays <= 2 && diffDays >= 0;
  }

  private canCreateMovement(user: User): boolean {
    return [UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL].includes(user.role);
  }

  private async canAccessOccurrenceMovements(occurrenceId: string, user: User): Promise<boolean> {
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Verificar se usuário tem acesso à ocorrência
    const occurrence = await this.occurrenceRepository.findOne({
      where: { id: occurrenceId },
      relations: ['forensicService', 'responsibleExpert']
    });

    if (!occurrence) return false;

    // Perito responsável pode acessar
    if (occurrence.responsibleExpert?.id === user.id) {
      return true;
    }

    // Verificar serviços forenses do usuário
    const userWithServices = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['forensicServices']
    });

    const userServiceIds = userWithServices?.forensicServices?.map(fs => fs.id) || [];
    return userServiceIds.includes(occurrence.forensicService?.id);
  }

  private async applyUserAccessFilters(qb: any, user: User): Promise<void> {
    if (user.role === UserRole.SUPER_ADMIN) {
      return; // Super admin vê tudo
    }

    if (user.role === UserRole.PERITO_OFICIAL || user.role === UserRole.SERVIDOR_ADMINISTRATIVO) {
      const userWithServices = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['forensicServices']
      });
      
      const serviceIds = userWithServices?.forensicServices?.map(fs => fs.id) || [];
      if (serviceIds.length > 0) {
        qb.andWhere('forensicService.id IN (:...serviceIds)', { serviceIds });
      } else {
        qb.andWhere('1 = 0'); // Sem serviços = sem acesso
      }
    }
  }
  // SOFT DELETE - APENAS SUPER ADMIN
async softDeleteMovement(id: string, user: User): Promise<void> {
  if (user.role !== UserRole.SUPER_ADMIN) {
    throw new ForbiddenException('Apenas Super Administradores podem excluir movimentações');
  }

  const movement = await this.movementRepository.findOne({ where: { id } });
  if (!movement) {
    throw new NotFoundException('Movimentação não encontrada');
  }

  // Soft delete: marcar como deletada ao invés de remover
  await this.movementRepository.softDelete(id);
}

  private mapToResponseDto(movement: OccurrenceMovement): OccurrenceMovementResponseDto {
    return {
      id: movement.id,
      occurrenceId: movement.occurrenceId,
      description: movement.description,
      deadline: movement.deadline,
      originalDeadline: movement.originalDeadline,
      isOverdue: movement.isOverdue,
      isNearDeadline: movement.isNearDeadline,
      wasExtended: movement.wasExtended,
      extensionJustification: movement.extensionJustification,
      performedBy: {
        id: movement.performedBy.id,
        name: movement.performedBy.name,
        role: movement.performedBy.role
      },
      performedAt: movement.performedAt,
      isSystemGenerated: movement.isSystemGenerated,
      additionalData: movement.additionalData
    };
  }
}
