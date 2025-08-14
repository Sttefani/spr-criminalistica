// Arquivo: src/environmental-crime-details/environmental-crime-details.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateEnvironmentalCrimeDetailDto } from './dto/create-environmental-crime-detail.dto';
import { UpdateEnvironmentalCrimeDetailDto } from './dto/update-environmental-crime-detail.dto';
import { EnvironmentalCrimeDetail } from './entities/environmental-crime-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Injectable()
export class EnvironmentalCrimeDetailsService {
  constructor(
    @InjectRepository(EnvironmentalCrimeDetail)
    private detailsRepository: Repository<EnvironmentalCrimeDetail>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  private async checkOccurrencePermission(occurrenceId: string, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id: occurrenceId },
      relations: ['createdBy', 'responsibleExpert'],
    });

    if (!occurrence) {
      throw new NotFoundException(`Ocorrência com o ID "${occurrenceId}" não encontrada.`);
    }

    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO;
    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isResponsible = occurrence.responsibleExpert?.id === currentUser.id;

    if (occurrence.isLocked && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('A ocorrência principal está travada e não pode ser modificada.');
    }

    if (!isOwner && !isAdmin && !isResponsible) {
      throw new ForbiddenException('Você não tem permissão para modificar esta ocorrência.');
    }

    return occurrence;
  }

  async create(createDto: CreateEnvironmentalCrimeDetailDto, currentUser: User): Promise<EnvironmentalCrimeDetail> {
    const { occurrenceId, examTypeIds, ...detailsData } = createDto;
    const occurrence = await this.checkOccurrencePermission(occurrenceId, currentUser);

    const existingDetails = await this.detailsRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (existingDetails) {
      throw new ConflictException(`Detalhes de crime ambiental já existem para esta ocorrência.`);
    }

    let exams: ExamType[] = [];
    if (examTypeIds && examTypeIds.length > 0) {
      exams = await this.examTypeRepository.findBy({ id: In(examTypeIds) });
      if (exams.length !== examTypeIds.length) {
        throw new NotFoundException('Um ou mais tipos de exame informados não foram encontrados.');
      }
    }

    // --- LÓGICA DE CRIAÇÃO CORRIGIDA ---
    const newDetails = new EnvironmentalCrimeDetail();
    Object.assign(newDetails, detailsData);
    newDetails.occurrence = occurrence;
    newDetails.examsPerformed = exams;
    // --- FIM DA CORREÇÃO ---

    return this.detailsRepository.save(newDetails);
  }

  async findByOccurrenceId(occurrenceId: string): Promise<EnvironmentalCrimeDetail> {
    const details = await this.detailsRepository.findOne({
      where: { occurrence: { id: occurrenceId } },
      relations: ['examsPerformed'],
    });
    if (!details) {
      throw new NotFoundException(`Nenhum detalhe de crime ambiental encontrado para a ocorrência com ID "${occurrenceId}".`);
    }
    return details;
  }

  async update(id: string, updateDto: UpdateEnvironmentalCrimeDetailDto, currentUser: User): Promise<EnvironmentalCrimeDetail> {
    const details = await this.detailsRepository.findOne({
      where: { id },
      relations: ['occurrence', 'examsPerformed'],
    });

    if (!details) {
      throw new NotFoundException(`Detalhes de crime ambiental com o ID "${id}" não encontrados.`);
    }

    await this.checkOccurrencePermission(details.occurrence.id, currentUser);

    const { occurrenceId, examTypeIds, ...detailsData } = updateDto;

    // --- LÓGICA DE ATUALIZAÇÃO CORRIGIDA ---
    Object.assign(details, detailsData);

    if (examTypeIds) {
      const exams = await this.examTypeRepository.findBy({ id: In(examTypeIds) });
      if (exams.length !== examTypeIds.length) {
        throw new NotFoundException('Um ou mais tipos de exame informados na atualização não foram encontrados.');
      }
      details.examsPerformed = exams;
    }

    return this.detailsRepository.save(details);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar este registro.');
    }
    const result = await this.detailsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Detalhes de crime ambiental com o ID "${id}" não encontrados.`);
    }
  }
}