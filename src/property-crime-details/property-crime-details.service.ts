// Arquivo: src/property-crime-details/property-crime-details.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyCrimeDetailDto } from './dto/create-property-crime-detail.dto';
import { UpdatePropertyCrimeDetailDto } from './dto/update-property-crime-detail.dto';
import { PropertyCrimeDetail } from './entities/property-crime-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PropertyCrimeDetailsService {
  constructor(
    @InjectRepository(PropertyCrimeDetail)
    private propertyCrimeRepository: Repository<PropertyCrimeDetail>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
    private eventEmitter: EventEmitter2,
  ) {}

  private async checkOccurrencePermission(occurrenceId: string, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id: occurrenceId },
      relations: ['createdBy'],
    });

    if (!occurrence) {
      throw new NotFoundException(`Ocorrência com o ID "${occurrenceId}" não encontrada.`);
    }

    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO;

    if (occurrence.isLocked && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('A ocorrência principal está travada e não pode ser modificada.');
    }

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para modificar esta ocorrência.');
    }

    return occurrence;
  }

  async create(createDto: CreatePropertyCrimeDetailDto, currentUser: User): Promise<PropertyCrimeDetail> {
    const { occurrenceId, ...detailsData } = createDto;
    const occurrence = await this.checkOccurrencePermission(occurrenceId, currentUser);

    const existingDetails = await this.propertyCrimeRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (existingDetails) {
      throw new ConflictException(`Detalhes de crime contra o patrimônio já existem para esta ocorrência.`);
    }

    const newDetails = this.propertyCrimeRepository.create({
      ...detailsData,
      occurrence: occurrence,
    });

    const savedDetails = await this.propertyCrimeRepository.save(newDetails);

    if (savedDetails.addressNotFound || savedDetails.noOneOnSite) {
      this.eventEmitter.emit(
        'property.crime.exception',
        { details: savedDetails, createdBy: currentUser },
      );
    }

    return savedDetails;
  }
  
  async findByOccurrenceId(occurrenceId: string): Promise<PropertyCrimeDetail> {
    const details = await this.propertyCrimeRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (!details) {
      throw new NotFoundException(`Nenhum detalhe de crime contra o patrimônio encontrado para a ocorrência com ID "${occurrenceId}".`);
    }
    return details;
  }

  async update(id: string, updateDto: UpdatePropertyCrimeDetailDto, currentUser: User): Promise<PropertyCrimeDetail> {
    const details = await this.propertyCrimeRepository.findOne({
      where: { id },
      relations: ['occurrence'],
    });

    if (!details) {
      throw new NotFoundException(`Detalhes de crime contra o patrimônio com o ID "${id}" não encontrados.`);
    }

    await this.checkOccurrencePermission(details.occurrence.id, currentUser);

    const { occurrenceId, ...detailsData } = updateDto;
    const updatedDetails = this.propertyCrimeRepository.merge(details, detailsData);
    
    const savedDetails = await this.propertyCrimeRepository.save(updatedDetails);

    if (savedDetails.addressNotFound || savedDetails.noOneOnSite) {
      this.eventEmitter.emit(
        'property.crime.exception',
        { details: savedDetails, updatedBy: currentUser },
      );
    }

    return savedDetails;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar este registro.');
    }
    const result = await this.propertyCrimeRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Detalhes de crime contra o patrimônio com o ID "${id}" não encontrados.`);
    }
  }
}