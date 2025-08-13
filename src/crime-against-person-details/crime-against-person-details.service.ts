// Arquivo: src/crime-against-person-details/crime-against-person-details.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCrimeAgainstPersonDetailDto } from './dto/create-crime-against-person-detail.dto';
import { UpdateCrimeAgainstPersonDetailDto } from './dto/update-crime-against-person-detail.dto';
import { CrimeAgainstPersonDetail } from './entities/crime-against-person-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';

@Injectable()
export class CrimeAgainstPersonDetailsService {
  constructor(
    @InjectRepository(CrimeAgainstPersonDetail)
    private detailsRepository: Repository<CrimeAgainstPersonDetail>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
  ) {}

  // Função auxiliar para checar permissão na ocorrência pai
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

  async create(createDto: CreateCrimeAgainstPersonDetailDto, currentUser: User): Promise<CrimeAgainstPersonDetail> {
    const { occurrenceId, ...detailsData } = createDto;

    const occurrence = await this.checkOccurrencePermission(occurrenceId, currentUser);

    const existingDetails = await this.detailsRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (existingDetails) {
      throw new ConflictException(`Detalhes de crime contra a pessoa já existem para esta ocorrência.`);
    }

    const newDetails = this.detailsRepository.create({
      ...detailsData,
      occurrence: occurrence,
    });

    return this.detailsRepository.save(newDetails);
  }

  async findByOccurrenceId(occurrenceId: string): Promise<CrimeAgainstPersonDetail> {
    const details = await this.detailsRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (!details) {
      throw new NotFoundException(`Nenhum detalhe de crime contra a pessoa encontrado para a ocorrência com ID "${occurrenceId}".`);
    }
    return details;
  }

  async update(id: string, updateDto: UpdateCrimeAgainstPersonDetailDto, currentUser: User): Promise<CrimeAgainstPersonDetail> {
    const details = await this.detailsRepository.findOne({
      where: { id },
      relations: ['occurrence'],
    });

    if (!details) {
      throw new NotFoundException(`Detalhes de crime contra a pessoa com o ID "${id}" não encontrados.`);
    }

    await this.checkOccurrencePermission(details.occurrence.id, currentUser);

    const { occurrenceId, ...detailsData } = updateDto;
    const updatedDetails = this.detailsRepository.merge(details, detailsData);
    return this.detailsRepository.save(updatedDetails);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar este registro.');
    }

    const result = await this.detailsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Detalhes de crime contra a pessoa com o ID "${id}" não encontrados.`);
    }
  }
}