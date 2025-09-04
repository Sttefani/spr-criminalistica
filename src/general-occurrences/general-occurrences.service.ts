/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GeneralOccurrence } from './entities/general-occurrence.entity';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { OccurrenceStatus } from './enums/occurrence-status.enum';

export interface PaginatedResult<T> { data: T[]; page: number; limit: number; total: number; }

@Injectable()
export class GeneralOccurrencesService {
  constructor(
  @InjectRepository(GeneralOccurrence)
  private readonly occurrenceRepository: Repository<GeneralOccurrence>,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
) {}

  async create(createDto: CreateGeneralOccurrenceDto, creatingUser: User): Promise<GeneralOccurrence> {
    const caseNumber = await this.generateCaseNumber();
    
    const newOccurrence = new GeneralOccurrence();
    Object.assign(newOccurrence, createDto);

    newOccurrence.caseNumber = caseNumber;
    newOccurrence.createdBy = creatingUser;
    
    // Lógica de Status Automático na Criação
    if (createDto.responsibleExpertId) {
      newOccurrence.status = OccurrenceStatus.IN_PROGRESS;
    } else {
      newOccurrence.status = OccurrenceStatus.PENDING;
    }
    
    // Mapeamento de relacionamentos
    newOccurrence.forensicService = { id: createDto.forensicServiceId } as any;
    newOccurrence.city = { id: createDto.cityId } as any;
    newOccurrence.procedure = createDto.procedureId ? { id: createDto.procedureId } as any : null;
    newOccurrence.requestingAuthority = createDto.requestingAuthorityId ? { id: createDto.requestingAuthorityId } as any : null;
    newOccurrence.requestingUnit = createDto.requestingUnitId ? { id: createDto.requestingUnitId } as any : null;
    newOccurrence.responsibleExpert = createDto.responsibleExpertId ? { id: createDto.responsibleExpertId } as any : null;
    newOccurrence.occurrenceClassification = createDto.occurrenceClassificationId ? { id: createDto.occurrenceClassificationId } as any : null;

    const savedOccurrence = await this.occurrenceRepository.save(newOccurrence);
    return this.findOne(savedOccurrence.id, creatingUser);
  }

  async findAllPaginated(page: number, limit: number, search?: string, user?: User): Promise<PaginatedResult<GeneralOccurrence>> {
  const qb = this.createBaseQueryBuilder();
  
  // NOVA LÓGICA DE FILTRO POR USUÁRIO
  if (user && !this.isAdmin(user)) {
    
    // Perito Oficial e Servidor Administrativo com Serviços Forenses
    if (user.role === UserRole.PERITO_OFICIAL || user.role === UserRole.SERVIDOR_ADMINISTRATIVO) {
      
      // Buscar serviços forenses do usuário
      const userWithServices = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['forensicServices']
      });
      
      const serviceIds = userWithServices?.forensicServices?.map(fs => fs.id) || [];
      console.log('Serviços do usuário:', serviceIds);
      
      if (serviceIds.length > 0) {
        if (user.role === UserRole.PERITO_OFICIAL) {
          // PERITO: Pool dos meus serviços (sem perito) + casos onde sou responsável
          qb.andWhere(
            '(occurrence.responsibleExpert IS NULL AND occurrence.forensicService.id IN (:...serviceIds)) OR ' +
            'expert.id = :userId',
            { serviceIds, userId: user.id }
          );
          console.log('Perito vê: pool dos serviços + casos próprios');
        } else {
          // SERVIDOR ADMIN: Todos os casos dos meus serviços
          qb.andWhere(
            'occurrence.forensicService.id IN (:...serviceIds)',
            { serviceIds }
          );
          console.log('Servidor admin vê: todos os casos dos serviços');
        }
      } else {
        // Sem serviços vinculados
        if (user.role === UserRole.PERITO_OFICIAL) {
          qb.andWhere('expert.id = :userId', { userId: user.id });
          console.log('Perito sem serviços: só casos próprios');
        } else {
          qb.andWhere('1 = 0'); // Servidor admin sem serviços não vê nada
          console.log('Servidor admin sem serviços: não vê nada');
        }
      }
      
    } else {
      // LÓGICA ATUAL: Autoridades e outros roles
      qb.andWhere('(creator.id = :userId OR expert.id = :userId OR authority_user.id = :userId)', { userId: user.id });
      console.log('Outros roles: lógica atual');
    }
    
  } else if (user) {
    console.log('Admin vê todas as ocorrências:', user.name, 'Role:', user.role);
  }
  
  // BUSCA (search)
  if (search) {
    // Limpar o termo de busca
    const cleanSearch = search.trim().replace(/\s+/g, '');
    
    qb.andWhere(
      '(REPLACE(occurrence.caseNumber, \'-\', \'\') ILIKE :search OR ' +
      'occurrence.caseNumber ILIKE :search OR ' +
      'occurrence.procedureNumber ILIKE :search OR ' +
      'authority.name ILIKE :search OR ' +
      'expert.name ILIKE :search)',
      { search: `%${cleanSearch}%` }
    );
  }
  
  // PAGINAÇÃO
  const skip = (page - 1) * limit;
  qb.orderBy('occurrence.createdAt', 'DESC').skip(skip).take(limit);
  
  // EXECUTAR QUERY
  const [data, total] = await qb.getManyAndCount();
  
  console.log('Retornando', data.length, 'ocorrências de', total, 'total para', user?.name || 'usuário não identificado');
  
  return { data, page, limit, total };
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
    if (!occurrence) { throw new NotFoundException('Ocorrência não encontrada'); }
    if (!this.canUserAccessOccurrence(occurrence, user)) { throw new ForbiddenException('Sem permissão para acessar esta ocorrência'); }
    return occurrence;
  }

  async update(id: string, updateDto: UpdateGeneralOccurrenceDto, user: User): Promise<GeneralOccurrence> {
    const originalOccurrence = await this.findOne(id, user);
    if (originalOccurrence.isLocked && !this.isAdmin(user)) { 
      throw new ForbiddenException('Ocorrência bloqueada para edição'); 
    }

    console.log('=== DEBUG STATUS ===');
    console.log('Status na base:', `"${originalOccurrence.status}"`);
    console.log('Perito original?', !!originalOccurrence.responsibleExpert);
    console.log('Novo perito ID:', updateDto.responsibleExpertId);

    const toUpdate = await this.occurrenceRepository.preload({ id: id, ...updateDto });
    if (!toUpdate) { 
      throw new NotFoundException('Falha ao preparar dados para atualização.'); 
    }

    // CORREÇÃO: Forçar limpeza quando responsibleExpertId for null/undefined
    if (updateDto.responsibleExpertId === null || updateDto.responsibleExpertId === undefined) {
      console.log('FORÇANDO limpeza manual do perito');
      toUpdate.responsibleExpert = null;
    }

    // Se está adicionando um perito específico
    if (updateDto.responsibleExpertId) {
      console.log('DEFININDO novo perito:', updateDto.responsibleExpertId);
      toUpdate.responsibleExpert = { id: updateDto.responsibleExpertId } as any;
    }

    // Lógica de Status Automático
    const hadExpert = !!originalOccurrence.responsibleExpert;
    const willHaveExpert = !!updateDto.responsibleExpertId;

    console.log('Tinha perito antes?', hadExpert);
    console.log('Vai ter perito depois?', willHaveExpert);

    // Se vai ter perito → status deve ser EM_ANDAMENTO
    if (willHaveExpert) {
      console.log('Tem perito → EM_ANDAMENTO');
      toUpdate.status = OccurrenceStatus.IN_PROGRESS;
    }
    // Se não vai ter perito → status deve ser AGUARDANDO_PERITO  
    else {
      console.log('Sem perito → AGUARDANDO_PERITO');
      toUpdate.status = OccurrenceStatus.PENDING;
    }

    console.log('Status que será salvo:', toUpdate.status);

    const updated = await this.occurrenceRepository.save(toUpdate);
    console.log('Status final salvo:', updated.status);
    console.log('=== FIM DEBUG ===');
    
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

  private canUserAccessOccurrence(occurrence: GeneralOccurrence, user: User): boolean {
    if (this.isAdmin(user)) return true;
    return (occurrence.createdBy?.id === user.id || occurrence.responsibleExpert?.id === user.id || occurrence.requestingAuthority?.user?.id === user.id);
  }
}