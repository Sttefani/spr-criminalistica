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
    const {
      procedureId, forensicServiceId, requestingUnitId, requestingAuthorityId,
      cityId, responsibleExpertId, ...occurrenceData
    } = createDto;

    // 1. Validação das dependências obrigatórias (definidas no DTO)
    const forensicService = await this.forensicServiceRepository.findOneBy({ id: forensicServiceId });
    if (!forensicService) throw new NotFoundException(`Serviço pericial com ID ${forensicServiceId} não encontrado.`);

    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) throw new NotFoundException(`Cidade com ID ${cityId} não encontrada.`);

    // 2. Criação da instância inicial da ocorrência
    const newOccurrence = this.occurrencesRepository.create({
      ...occurrenceData,
      forensicService,
      city,
      createdBy: creatingUser,
    });

    // 3. Validação e associação das dependências opcionais
    if (procedureId) {
      const procedure = await this.procedureRepository.findOneBy({ id: procedureId });
      if (!procedure) throw new NotFoundException(`Procedimento com ID ${procedureId} não encontrado.`);
      newOccurrence.procedure = procedure;
    }
    if (requestingUnitId) {
      const unit = await this.unitRepository.findOneBy({ id: requestingUnitId });
      if (!unit) throw new NotFoundException(`Unidade Demandante com ID ${requestingUnitId} não encontrada.`);
      newOccurrence.requestingUnit = unit;
    }
    if (requestingAuthorityId) {
      const authority = await this.authorityRepository.findOneBy({ id: requestingAuthorityId });
      if (!authority) throw new NotFoundException(`Autoridade com ID ${requestingAuthorityId} não encontrada.`);
      newOccurrence.requestingAuthority = authority;
    }
    if (responsibleExpertId) {
      const expert = await this.userRepository.findOneBy({ id: responsibleExpertId });
      if (!expert) throw new NotFoundException(`Perito com ID ${responsibleExpertId} não encontrado.`);
      newOccurrence.responsibleExpert = expert;
    }

    // 4. Geração do número do caso
    const year = new Date().getFullYear();
    const countThisYear = await this.occurrencesRepository.count({ where: { caseNumber: Like(`%-${year}`) } });
    const sequential = countThisYear + 1;
    newOccurrence.caseNumber = `${sequential}-${year}`;

    // 5. Salvar a entidade completa no banco de dados
    return this.occurrencesRepository.save(newOccurrence);
  }

  async findAll(currentUser: User): Promise<GeneralOccurrence[]> {
    const queryBuilder = this.occurrencesRepository.createQueryBuilder('occurrence')
      .leftJoinAndSelect('occurrence.procedure', 'procedure')
      .leftJoinAndSelect('occurrence.forensicService', 'forensicService')
      .leftJoinAndSelect('occurrence.responsibleExpert', 'expert')
      .leftJoinAndSelect('occurrence.requestingUnit', 'unit')
      .leftJoinAndSelect('occurrence.requestingAuthority', 'authority')
      .leftJoinAndSelect('occurrence.city', 'city')
      .leftJoinAndSelect('occurrence.createdBy', 'creator');

    if (currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO) {
      return queryBuilder.getMany();
    }
    if (currentUser.role === UserRole.PERITO_OFICIAL) {
      queryBuilder.where('expert.id = :userId', { userId: currentUser.id });
      return queryBuilder.getMany();
    }
    if (currentUser.role === UserRole.DELEGADO || currentUser.role === UserRole.OFICIAL_INVESTIGADOR) {
      queryBuilder.where('authority.user_id = :userId', { userId: currentUser.id });
      return queryBuilder.getMany();
    }
    return [];
  }

  async findOne(id: string, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id },
      relations: ['procedure', 'forensicService', 'responsibleExpert', 'requestingUnit', 'requestingAuthority', 'city', 'createdBy'],
    });

    if (!occurrence) throw new NotFoundException(`Ocorrência com o ID "${id}" não encontrada.`);

    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO;
    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isResponsible = occurrence.responsibleExpert?.id === currentUser.id;
    
    if (!isAdmin && !isOwner && !isResponsible) {
      throw new ForbiddenException('Você não tem permissão para visualizar esta ocorrência.');
    }
    
    return occurrence;
  }

  async update(id: string, updateDto: UpdateGeneralOccurrenceDto, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id },
      relations: ['createdBy', 'responsibleExpert'],
    });

    if (!occurrence) throw new NotFoundException(`Ocorrência com o ID "${id}" não encontrada.`);

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
    }

    const { procedureId, forensicServiceId, requestingUnitId, requestingAuthorityId, cityId, responsibleExpertId, ...occurrenceData } = updateDto;
    const updatedOccurrence = this.occurrencesRepository.merge(occurrence, occurrenceData);

    if (procedureId) {
        const procedure = await this.procedureRepository.findOneBy({ id: procedureId });
        if (!procedure) throw new NotFoundException(`Procedimento com ID ${procedureId} não encontrado.`);
        updatedOccurrence.procedure = procedure;
    }
    // Adicionar a mesma lógica para os outros relacionamentos aqui (forensicServiceId, etc.)

    return this.occurrencesRepository.save(updatedOccurrence);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const occurrence = await this.findOne(id, currentUser);
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar ocorrências.');
    }
    await this.occurrencesRepository.softDelete(occurrence.id);
  }
}