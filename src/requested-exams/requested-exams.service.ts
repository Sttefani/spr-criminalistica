// Arquivo: src/requested-exams/requested-exams.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestedExamDto } from './dto/create-requested-exam.dto';
import { UpdateRequestedExamDto } from './dto/update-requested-exam.dto';
import { RequestedExam, RequestedExamStatus } from './entities/requested-exam.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';

@Injectable()
export class RequestedExamsService {
  constructor(
    @InjectRepository(RequestedExam)
    private requestedExamsRepository: Repository<RequestedExam>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
    @InjectRepository(ExamType)
    private examTypesRepository: Repository<ExamType>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreateRequestedExamDto, creatingUser: User): Promise<RequestedExam> {
    const { occurrenceId, examTypeId, assignedExpertId } = createDto;

    const occurrence = await this.occurrencesRepository.findOneBy({ id: occurrenceId });
    if (!occurrence) throw new NotFoundException(`Ocorrência com o ID "${occurrenceId}" não encontrada.`);

    const examType = await this.examTypesRepository.findOneBy({ id: examTypeId });
    if (!examType) throw new NotFoundException(`Tipo de exame com o ID "${examTypeId}" não encontrado.`);

    let assignedExpert: User | undefined = undefined;
    if (assignedExpertId) {
      const expert = await this.usersRepository.findOneBy({ id: assignedExpertId });
      if (!expert) throw new NotFoundException(`Perito com o ID "${assignedExpertId}" não encontrado.`);
      assignedExpert = expert;
    }

    const newRequestedExam = this.requestedExamsRepository.create({
      occurrence,
      examType,
      assignedExpert,
      createdBy: creatingUser,
    });

    return this.requestedExamsRepository.save(newRequestedExam);
  }

  async findAll(): Promise<RequestedExam[]> {
    return this.requestedExamsRepository.find({
      relations: ['occurrence', 'examType', 'assignedExpert', 'createdBy'],
    });
  }

  /**
   * Encontra todos os exames solicitados para uma ocorrência específica.
   */
  async findAllByOccurrence(occurrenceId: string): Promise<RequestedExam[]> {
    return this.requestedExamsRepository.find({
      where: { occurrence: { id: occurrenceId } },
      relations: ['examType', 'assignedExpert', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<RequestedExam> {
    const requestedExam = await this.requestedExamsRepository.findOne({
      where: { id },
      relations: ['occurrence', 'examType', 'assignedExpert', 'createdBy'],
    });
    if (!requestedExam) {
      throw new NotFoundException(`Exame solicitado com o ID "${id}" não encontrado.`);
    }
    return requestedExam;
  }

  async update(id: string, updateDto: UpdateRequestedExamDto, currentUser: User): Promise<RequestedExam> {
    const requestedExam = await this.requestedExamsRepository.findOne({
        where: { id },
        relations: ['assignedExpert'] // Carrega o perito designado
    });
    if (!requestedExam) {
      throw new NotFoundException(`Exame solicitado com o ID "${id}" não encontrado.`);
    }

    // --- LÓGICA DE PERMISSÃO REFINADA ---
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN;
    // Verifica se o usuário é o perito designado para ESTE exame
    const isAssignedExpert = requestedExam.assignedExpert?.id === currentUser.id;

    if (!isAdmin && !isAssignedExpert) {
        throw new ForbiddenException('Você não tem permissão para editar este exame.');
    }
    // --- FIM DA LÓGICA DE PERMISSÃO ---

    const { assignedExpertId, ...examData } = updateDto;
    const updatedExam = this.requestedExamsRepository.merge(requestedExam, examData);
    
    if (assignedExpertId) {
      const expert = await this.usersRepository.findOneBy({ id: assignedExpertId });
      if (!expert) throw new NotFoundException(`Perito com o ID "${assignedExpertId}" não encontrado.`);
      updatedExam.assignedExpert = expert;
    }

    return this.requestedExamsRepository.save(updatedExam);
  }

    /**
   * Remove uma solicitação de exame, com regras de permissão baseadas no status.
   */
  async remove(id: string, currentUser: User): Promise<void> {
    // 1. Primeiro, buscamos o exame para podermos checar seu status
    const requestedExam = await this.findOne(id); // Reutilizamos o findOne que já busca o exame

    // 2. Definimos as permissões
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN;

    // 3. Aplicamos a regra de negócio
    // Se o usuário NÃO é um admin E o status do exame NÃO é PENDING, bloqueia.
    if (!isAdmin && requestedExam.status !== RequestedExamStatus.PENDING) {
      throw new ForbiddenException(
        `Este exame não pode ser removido pois seu status é "${requestedExam.status}". Contate um administrador.`,
      );
    }

    // 4. Se passou pela verificação, deleta o registro.
    const result = await this.requestedExamsRepository.delete(id);
    if (result.affected === 0) {
      // Esta checagem é redundante, pois o findOne já faria isso, mas é uma segurança extra.
      throw new NotFoundException(`Exame solicitado com o ID "${id}" não encontrado.`);
    }
  }
}