// Arquivo: src/general-occurrences/general-occurrences.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { GeneralOccurrence } from './entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';

@Injectable()
export class GeneralOccurrencesService {
  constructor(
    @InjectRepository(GeneralOccurrence) private occurrencesRepository: Repository<GeneralOccurrence>,
    @InjectRepository(Procedure) private procedureRepository: Repository<Procedure>,
    @InjectRepository(ForensicService) private forensicServiceRepository: Repository<ForensicService>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RequestingUnit) private unitRepository: Repository<RequestingUnit>,
    @InjectRepository(Authority) private authorityRepository: Repository<Authority>,
    @InjectRepository(City) private cityRepository: Repository<City>,
  ) {}

  async create(createDto: CreateGeneralOccurrenceDto, creatingUser: User): Promise<GeneralOccurrence> {
    // ... (seu método create está perfeito, continua igual)
    const { procedureId, forensicServiceId, requestingUnitId, requestingAuthorityId, cityId, responsibleExpertId, ...occurrenceData } = createDto;
    const forensicService = await this.forensicServiceRepository.findOneBy({ id: forensicServiceId });
    if (!forensicService) throw new NotFoundException(`Serviço pericial com ID ${forensicServiceId} não encontrado.`);
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) throw new NotFoundException(`Cidade com ID ${cityId} não encontrada.`);
    let procedure: Procedure | null = null;
    if (procedureId) {
      procedure = await this.procedureRepository.findOneBy({ id: procedureId });
      if (!procedure) throw new NotFoundException(`Procedimento com ID ${procedureId} não encontrado.`);
    }
    let requestingUnit: RequestingUnit | null = null;
    if (requestingUnitId) {
      requestingUnit = await this.unitRepository.findOneBy({ id: requestingUnitId });
      if (!requestingUnit) throw new NotFoundException(`Unidade Demandante com ID ${requestingUnitId} não encontrada.`);
    }
    let requestingAuthority: Authority | null = null;
    if (requestingAuthorityId) {
      requestingAuthority = await this.authorityRepository.findOneBy({ id: requestingAuthorityId });
      if (!requestingAuthority) throw new NotFoundException(`Autoridade com ID ${requestingAuthorityId} não encontrada.`);
    }
    let responsibleExpert: User | null = null;
    if (responsibleExpertId) {
      responsibleExpert = await this.userRepository.findOneBy({ id: responsibleExpertId });
      if (!responsibleExpert) throw new NotFoundException(`Perito com ID ${responsibleExpertId} não encontrado.`);
    }
    const year = new Date().getFullYear();
    const countThisYear = await this.occurrencesRepository.count({ where: { caseNumber: Like(`%-${year}`) } });
    const sequential = countThisYear + 1;
    const caseNumber = `${sequential}-${year}`;
    const newOccurrence = this.occurrencesRepository.create({ ...occurrenceData, caseNumber, forensicService, city, procedure, requestingUnit, requestingAuthority, responsibleExpert, createdBy: creatingUser });
    return this.occurrencesRepository.save(newOccurrence);
  }

  async findAll(currentUser: User): Promise<GeneralOccurrence[]> {
    // ... (seu método findAll está perfeito, continua igual)
    const queryBuilder = this.occurrencesRepository.createQueryBuilder('occurrence').leftJoinAndSelect('occurrence.procedure', 'procedure').leftJoinAndSelect('occurrence.forensicService', 'forensicService').leftJoinAndSelect('occurrence.responsibleExpert', 'expert').leftJoinAndSelect('occurrence.requestingUnit', 'unit').leftJoinAndSelect('occurrence.requestingAuthority', 'authority').leftJoinAndSelect('occurrence.city', 'city').leftJoinAndSelect('occurrence.createdBy', 'creator');
    if (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO) { return queryBuilder.getMany(); }
    if (currentUser.role === UserRole.PERITO_OFICIAL) { queryBuilder.where('expert.id = :userId', { userId: currentUser.id }); return queryBuilder.getMany(); }
    if (currentUser.role === UserRole.DELEGADO || currentUser.role === UserRole.OFICIAL_INVESTIGADOR) { queryBuilder.where('authority.user_id = :userId', { userId: currentUser.id }); return queryBuilder.getMany(); }
    return [];
  }

  async findOne(id: string, currentUser: User): Promise<GeneralOccurrence> {
    // ... (seu método findOne está perfeito, continua igual)
    const occurrence = await this.occurrencesRepository.findOne({ where: { id }, relations: ['procedure', 'forensicService', 'responsibleExpert', 'requestingUnit', 'requestingAuthority', 'city', 'createdBy'] });
    if (!occurrence) throw new NotFoundException(`Ocorrência com o ID "${id}" não encontrada.`);
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO;
    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isResponsible = occurrence.responsibleExpert?.id === currentUser.id;
    if (!isAdmin && !isOwner && !isResponsible) { throw new ForbiddenException('Você não tem permissão para visualizar esta ocorrência.'); }
    return occurrence;
  }

  // --- MÉTODO UPDATE CORRIGIDO ---
  async update(id: string, updateDto: UpdateGeneralOccurrenceDto, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id },
      relations: ['createdBy', 'responsibleExpert'],
    });

    if (!occurrence) {
      throw new NotFoundException(`Ocorrência com o ID "${id}" não encontrada.`);
    }

    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN;

    if (occurrence.isLocked && !isAdmin) {
      throw new ForbiddenException('Esta ocorrência está travada e não pode mais ser editada.');
    }
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para editar esta ocorrência.');
    }

    if (updateDto.additionalFields) {
      const oldFields = occurrence.additionalFields || {};
      const newFields = updateDto.additionalFields;
      const oldKeys = Object.keys(oldFields);
      const newKeys = Object.keys(newFields);

      for (const oldKey of oldKeys) {
        if (!newKeys.includes(oldKey) && !isAdmin) {
          throw new ForbiddenException(`Você não tem permissão para remover o campo adicional "${oldKey}". Apenas o Super Admin pode remover campos.`);
        }
      }
    } // <-- CHAVE DE FECHAMENTO DO 'if' ADICIONADA AQUI

    const { procedureId, forensicServiceId, requestingUnitId, requestingAuthorityId, cityId, responsibleExpertId, ...occurrenceData } = updateDto;
    const updatedOccurrence = this.occurrencesRepository.merge(occurrence, occurrenceData);

    if (procedureId) {
        const procedure = await this.procedureRepository.findOneBy({ id: procedureId });
        if (!procedure) throw new NotFoundException(`Procedimento com ID ${procedureId} não encontrado.`);
        updatedOccurrence.procedure = procedure;
    }
    // Adicionar a mesma lógica para os outros relacionamentos aqui

    return this.occurrencesRepository.save(updatedOccurrence);
  }
  // --- FIM DO MÉTODO UPDATE ---

  async remove(id: string, currentUser: User): Promise<void> {
    const occurrence = await this.findOne(id, currentUser);
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar ocorrências.');
    }
    await this.occurrencesRepository.softDelete(occurrence.id);
  }
}