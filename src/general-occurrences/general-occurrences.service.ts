/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { GeneralOccurrence } from './entities/general-occurrence.entity';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { OccurrenceStatus } from './enums/occurrence-status.enum';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

export interface PaginatedResult<T> { data: T[]; page: number; limit: number; total: number; }

@Injectable()
export class GeneralOccurrencesService {
  constructor(
  @InjectRepository(GeneralOccurrence)
  private readonly occurrenceRepository: Repository<GeneralOccurrence>,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(ExamType)
  private readonly examTypeRepository: Repository<ExamType>,
) {}

  // ... (outros métodos como create, findOne, etc. que já existem)

  // ✅ ASSINATURA DO MÉTODO ATUALIZADA para receber os novos filtros
  async findAllPaginated(
    page: number, 
    limit: number, 
    search?: string, 
    user?: User, 
    forensicServiceId?: string,
    onlyMine?: boolean
  ): Promise<PaginatedResult<GeneralOccurrence>> {
    const qb = this.createBaseQueryBuilder();
  
    // A sua lógica de permissões baseada nos serviços do usuário continua a mesma
    if (user && (user.role === UserRole.PERITO_OFICIAL || user.role === UserRole.SERVIDOR_ADMINISTRATIVO)) {
        const userWithServices = await this.userRepository.findOne({ where: { id: user.id }, relations: ['forensicServices'] });
        const serviceIds = userWithServices?.forensicServices?.map(fs => fs.id) || [];
        if (serviceIds.length > 0) {
            qb.andWhere('occurrence.forensicService.id IN (:...serviceIds)', { serviceIds });
        } else {
             qb.andWhere('1 = 0'); // Se não tem serviços, não vê nada
        }
    }
    
    // ✅ NOVO: Adicionado o filtro por serviço específico (do dropdown do frontend)
    if (forensicServiceId && forensicServiceId !== 'all') {
      qb.andWhere('occurrence.forensicService.id = :forensicServiceId', { forensicServiceId });
    }

    // ✅ NOVO: Adicionado o filtro "Minhas Ocorrências" (do toggle do frontend)
    if (onlyMine && user && user.role === UserRole.PERITO_OFICIAL) {
        qb.andWhere('expert.id = :userId', { userId: user.id });
    }

    // O resto da sua lógica de busca e paginação continua igual
    if (search) {
      const cleanSearch = search.trim().replace(/\s+/g, '');
      qb.andWhere(
        '(REPLACE(occurrence.caseNumber, \'-\', \'\') ILIKE :search OR ' +
        'occurrence.caseNumber ILIKE :search OR ' +
        'occurrence.procedureNumber ILIKE :search)',
        { search: `%${cleanSearch}%` }
      );
    }
    
    const skip = (page - 1) * limit;
    qb.orderBy('occurrence.createdAt', 'DESC').skip(skip).take(limit);
    
    const [data, total] = await qb.getManyAndCount();
    
    return { data, page, limit, total };
  }

  // ... (o resto dos seus métodos de serviço)
  async create(createDto: CreateGeneralOccurrenceDto, creatingUser: User): Promise<GeneralOccurrence> {
    const { examTypeIds, ...restDto } = createDto;
     const caseNumber = await this.generateCaseNumber();
    const newOccurrence = new GeneralOccurrence();
    Object.assign(newOccurrence, restDto);   
     newOccurrence.caseNumber = caseNumber;
    newOccurrence.createdBy = creatingUser;
    if (createDto.responsibleExpertId) {
      newOccurrence.status = OccurrenceStatus.IN_PROGRESS;
    } else {
      newOccurrence.status = OccurrenceStatus.PENDING;
    }
    newOccurrence.forensicService = { id: createDto.forensicServiceId } as any;
    newOccurrence.city = { id: createDto.cityId } as any;
    newOccurrence.procedure = createDto.procedureId ? { id: createDto.procedureId } as any : null;
    newOccurrence.requestingAuthority = createDto.requestingAuthorityId ? { id: createDto.requestingAuthorityId } as any : null;
    newOccurrence.requestingUnit = createDto.requestingUnitId ? { id: createDto.requestingUnitId } as any : null;
    newOccurrence.responsibleExpert = createDto.responsibleExpertId ? { id: createDto.responsibleExpertId } as any : null;
    newOccurrence.occurrenceClassification = createDto.occurrenceClassificationId ? { id: createDto.occurrenceClassificationId } as any : null;
        if (examTypeIds && examTypeIds.length > 0) {
      const examTypes = await this.examTypeRepository.find({
        where: { id: In(examTypeIds) }
      });
  newOccurrence.examTypes = examTypes;
} else {
  newOccurrence.examTypes = [];
}
    const savedOccurrence = await this.occurrenceRepository.save(newOccurrence);
    return this.findOne(savedOccurrence.id, creatingUser);
  }

  async findAllForUser(user: User): Promise<GeneralOccurrence[]> {
    const qb = this.createBaseQueryBuilder();
    if (!this.isAdmin(user)) {
      qb.andWhere('(creator.id = :userId OR expert.id = :userId OR authority_user.id = :userId)', { userId: user.id });
    }
    return qb.orderBy('occurrence.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, user: User): Promise<GeneralOccurrence> {
    const occurrence = await this.createBaseQueryBuilder().andWhere('occurrence.id = :id', { id }).getOne();
    if (!occurrence) { 
      throw new NotFoundException('Ocorrência não encontrada'); 
    }
    if (!(await this.canUserAccessOccurrence(occurrence, user))) { 
      throw new ForbiddenException('Sem permissão para acessar esta ocorrência'); 
    }
    return occurrence;
  }

  async update(id: string, updateDto: UpdateGeneralOccurrenceDto, user: User): Promise<GeneralOccurrence> {
  const { examTypeIds, ...restDto } = updateDto;
  const originalOccurrence = await this.findOne(id, user);

  if (originalOccurrence.isLocked && !this.isAdmin(user)) { 
    throw new ForbiddenException('Ocorrência bloqueada para edição'); 
  }
  
  if (originalOccurrence.responsibleExpert && user.role !== UserRole.SUPER_ADMIN) {
    throw new ForbiddenException('Apenas administradores podem editar ocorrências já atribuídas a um perito.');
  }
  
    const toUpdate = await this.occurrenceRepository.preload({ id: id, ...restDto }); 
     if (!toUpdate) { 
    throw new NotFoundException('Falha ao preparar dados para atualização.'); 
  }
  
  // CORRIGIR: Tratar TODOS os relacionamentos
  
  // Perito Responsável
  if (updateDto.responsibleExpertId === null || updateDto.responsibleExpertId === undefined) {
    toUpdate.responsibleExpert = null;
  } else if (updateDto.responsibleExpertId) {
    toUpdate.responsibleExpert = { id: updateDto.responsibleExpertId } as any;
  }
  
  // Autoridade Requisitante
  if (updateDto.requestingAuthorityId === null || updateDto.requestingAuthorityId === undefined) {
    toUpdate.requestingAuthority = null;
  } else if (updateDto.requestingAuthorityId) {
    toUpdate.requestingAuthority = { id: updateDto.requestingAuthorityId } as any;
  }
  
  // Unidade Demandante
  if (updateDto.requestingUnitId === null || updateDto.requestingUnitId === undefined) {
    toUpdate.requestingUnit = null;
  } else if (updateDto.requestingUnitId) {
    toUpdate.requestingUnit = { id: updateDto.requestingUnitId } as any;
  }
  
  // Serviço Forense
  if (updateDto.forensicServiceId) {
    toUpdate.forensicService = { id: updateDto.forensicServiceId } as any;
  }
  
  // Cidade
  if (updateDto.cityId) {
    toUpdate.city = { id: updateDto.cityId } as any;
  }
  
  // Procedimento
  if (updateDto.procedureId === null || updateDto.procedureId === undefined) {
    toUpdate.procedure = null;
  } else if (updateDto.procedureId) {
    toUpdate.procedure = { id: updateDto.procedureId } as any;
  }
  
  // Classificação
  if (updateDto.occurrenceClassificationId === null || updateDto.occurrenceClassificationId === undefined) {
    toUpdate.occurrenceClassification = null;
  } else if (updateDto.occurrenceClassificationId) {
    toUpdate.occurrenceClassification = { id: updateDto.occurrenceClassificationId } as any;
  }
  // Tratar examTypes
        if (examTypeIds !== undefined) {
          if (examTypeIds.length > 0) {
            const examTypes = await this.examTypeRepository.find({
              where: { id: In(examTypeIds) }
            });
            toUpdate.examTypes = examTypes;
          } else {
            toUpdate.examTypes = [];
          }
        }
  
  // Lógica do status baseada no perito
  const willHaveExpert = !!updateDto.responsibleExpertId;
  if (willHaveExpert) {
    toUpdate.status = OccurrenceStatus.IN_PROGRESS;
  } else if (updateDto.responsibleExpertId === null || updateDto.responsibleExpertId === undefined) {
    toUpdate.status = OccurrenceStatus.PENDING;
  }
  
  const updated = await this.occurrenceRepository.save(toUpdate);
  return this.findOne(updated.id, user);
}

  async remove(id: string, user: User): Promise<void> {
    if (user.role !== UserRole.SUPER_ADMIN) { throw new ForbiddenException('Apenas Super Admin pode remover ocorrências'); }
    const result = await this.occurrenceRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Ocorrência não encontrada.');
  }
  
  private createBaseQueryBuilder(): SelectQueryBuilder<GeneralOccurrence> {
    return this.occurrenceRepository.createQueryBuilder('occurrence')
      .leftJoinAndSelect('occurrence.procedure', 'procedure')
      .leftJoinAndSelect('occurrence.forensicService', 'forensicService')
      .leftJoinAndSelect('occurrence.responsibleExpert', 'expert')
      .leftJoinAndSelect('occurrence.requestingUnit', 'unit')
      .leftJoinAndSelect('occurrence.requestingAuthority', 'authority')
      .leftJoinAndSelect('authority.user', 'authority_user')
      .leftJoinAndSelect('occurrence.city', 'city')
      .leftJoinAndSelect('occurrence.occurrenceClassification', 'classification')
      .leftJoinAndSelect('occurrence.createdBy', 'creator')
      .leftJoinAndSelect('occurrence.examTypes', 'examTypes')
      .where('occurrence.deletedAt IS NULL');
  }

  private async generateCaseNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const result = await this.occurrenceRepository.createQueryBuilder('occurrence')
      .select("MAX(CAST(SPLIT_PART(occurrence.caseNumber, '-', 1) AS INTEGER))", 'max_seq')
      .where("occurrence.caseNumber LIKE :pattern", { pattern: `%${currentYear}` })
      .getRawOne();
    const nextSequential = (result?.max_seq || 0) + 1;
    return `${nextSequential.toString().padStart(6, '0')}-${currentYear}`;
  }

  private isAdmin(user: User): boolean {
    return [UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO].includes(user.role);
  }

  private async canUserAccessOccurrence(occurrence: GeneralOccurrence, user: User): Promise<boolean> {
    if (this.isAdmin(user)) return true;
    if (occurrence.createdBy?.id === user.id || 
        occurrence.responsibleExpert?.id === user.id || 
        occurrence.requestingAuthority?.user?.id === user.id) {
      return true;
    }
    if (user.role === UserRole.PERITO_OFICIAL || user.role === UserRole.SERVIDOR_ADMINISTRATIVO) {
      const userWithServices = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['forensicServices']
      });
      const userServiceIds = userWithServices?.forensicServices?.map(fs => fs.id) || [];
      if (userServiceIds.includes(occurrence.forensicService?.id)) {
        return true;
      }
    }
    return false;
  }
  // MÉTODO PARA ALTERAR STATUS DA OCORRÊNCIA
async changeStatus(
  id: string, 
  newStatus: string, 
  observations: string | null, 
  user: User
): Promise<GeneralOccurrence> {
  // 1. Verificar se ocorrência existe e usuário tem acesso
  const occurrence = await this.findOne(id, user);
  
  // 2. Validar se status atual permite mudança
  if (occurrence.status !== OccurrenceStatus.IN_PROGRESS) {
    throw new ForbiddenException(`Não é possível alterar status. Status atual: ${occurrence.status}`);
  }
  
  // 3. Validar novo status
  const allowedNewStatuses = [OccurrenceStatus.COMPLETED, OccurrenceStatus.CANCELLED];
  if (!allowedNewStatuses.includes(newStatus as OccurrenceStatus)) {
    throw new ForbiddenException(`Status inválido. Permitidos: ${allowedNewStatuses.join(', ')}`);
  }
  
  // 4. Validar permissões (apenas super_admin e servidor_administrativo)
  if (![UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO].includes(user.role)) {
    throw new ForbiddenException('Apenas administradores podem alterar status de ocorrências');
  }
  
  // 5. Atualizar status
  await this.occurrenceRepository.update(id, {
  status: newStatus as OccurrenceStatus,
  statusChangeObservations: observations
});
  // 6. Retornar ocorrência atualizada
  return this.findOne(id, user);
}
}

