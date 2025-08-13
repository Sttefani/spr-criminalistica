// Arquivo: src/genetic-comparison-details/genetic-comparison-details.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateGeneticComparisonDetailDto } from './dto/create-genetic-comparison-detail.dto';
import { UpdateGeneticComparisonDetailDto } from './dto/update-genetic-comparison-detail.dto';
import { GeneticComparisonDetail } from './entities/genetic-comparison-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Injectable()
export class GeneticComparisonDetailsService {
  constructor(
    @InjectRepository(GeneticComparisonDetail)
    private detailsRepository: Repository<GeneticComparisonDetail>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  // Função auxiliar para checar permissão na ocorrência pai (reutilizada e adaptada)
  private async checkOccurrencePermission(occurrenceId: string, currentUser: User): Promise<GeneralOccurrence> {
    const occurrence = await this.occurrencesRepository.findOne({
      where: { id: occurrenceId },
      relations: ['createdBy', 'responsibleExpert'], // Carrega o perito responsável da ocorrência
    });

    if (!occurrence) {
      throw new NotFoundException(`Ocorrência com o ID "${occurrenceId}" não encontrada.`);
    }

    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.SERVIDOR_ADMINISTRATIVO;
    const isOwner = occurrence.createdBy.id === currentUser.id;
    const isResponsible = occurrence.responsibleExpert?.id === currentUser.id;

    // A regra de travamento da ocorrência PAI ainda se aplica
    if (occurrence.isLocked && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('A ocorrência principal está travada e não pode ser modificada.');
    }

    // Apenas o dono, o responsável ou um admin podem criar/editar detalhes
    if (!isOwner && !isAdmin && !isResponsible) {
      throw new ForbiddenException('Você não tem permissão para modificar esta ocorrência.');
    }

    return occurrence;
  }

  async create(createDto: CreateGeneticComparisonDetailDto, currentUser: User): Promise<GeneticComparisonDetail> {
    const { occurrenceId, examTypeIds, ...detailsData } = createDto;
    const occurrence = await this.checkOccurrencePermission(occurrenceId, currentUser);

    const existingDetails = await this.detailsRepository.findOneBy({ occurrence: { id: occurrenceId } });
    if (existingDetails) {
      throw new ConflictException(`Detalhes de comparação genética já existem para esta ocorrência.`);
    }

    // Valida e busca as técnicas (exames) se fornecidas
    let exams: ExamType[] = [];
    if (examTypeIds && examTypeIds.length > 0) {
      exams = await this.examTypeRepository.findBy({ id: In(examTypeIds) });
      if (exams.length !== examTypeIds.length) {
        throw new NotFoundException('Um ou mais tipos de exame informados não foram encontrados.');
      }
    }

    const newDetails = this.detailsRepository.create({
      ...detailsData,
      occurrence: occurrence,
      examsPerformed: exams,
    });

    return this.detailsRepository.save(newDetails);
  }

  async findByOccurrenceId(occurrenceId: string): Promise<GeneticComparisonDetail> {
    const details = await this.detailsRepository.findOne({
      where: { occurrence: { id: occurrenceId } },
      relations: ['examsPerformed'],
    });
    if (!details) {
      throw new NotFoundException(`Nenhum detalhe de comparação genética encontrado para a ocorrência com ID "${occurrenceId}".`);
    }
    return details;
  }

  async findOne(id: string): Promise<GeneticComparisonDetail> {
    const details = await this.detailsRepository.findOne({
        where: { id },
        relations: ['occurrence', 'examsPerformed'], // Carrega as relações
    });
    if (!details) {
      throw new NotFoundException(`Detalhes de comparação genética com o ID "${id}" não encontrados.`);
    }
    // A lógica de permissão de visualização (todos do LGF) será no controller
    return details;
  }

  async update(id: string, updateDto: UpdateGeneticComparisonDetailDto, currentUser: User): Promise<GeneticComparisonDetail> {
    const details = await this.detailsRepository.findOne({
      where: { id },
      relations: ['occurrence', 'occurrence.responsibleExpert'], // Carrega a ocorrência e o perito responsável
    });

    if (!details) {
      throw new NotFoundException(`Detalhes de comparação genética com o ID "${id}" não encontrados.`);
    }

    // A lógica de permissão de edição é baseada no perito responsável da ocorrência PAI
    await this.checkOccurrencePermission(details.occurrence.id, currentUser);

    const { occurrenceId, examTypeIds, ...detailsData } = updateDto;
    const updatedDetails = this.detailsRepository.merge(details, detailsData);

    if (examTypeIds) {
        const exams = await this.examTypeRepository.findBy({ id: In(examTypeIds) });
        if (exams.length !== examTypeIds.length) {
            throw new NotFoundException('Um ou mais tipos de exame informados na atualização não foram encontrados.');
        }
        updatedDetails.examsPerformed = exams;
    }

    return this.detailsRepository.save(updatedDetails);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Apenas o Super Admin pode deletar este registro.');
    }
    const result = await this.detailsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Detalhes de comparação genética com o ID "${id}" não encontrados.`);
    }
  }
}