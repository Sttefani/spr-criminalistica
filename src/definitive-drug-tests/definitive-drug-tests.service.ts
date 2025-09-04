/* eslint-disable prettier/prettier */
// Arquivo: src/definitive-drug-tests/definitive-drug-tests.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { CreateDefinitiveDrugTestDto } from './dto/create-definitive-drug-test.dto';
import { UpdateDefinitiveDrugTestDto } from './dto/update-definitive-drug-test.dto';
import { DefinitiveDrugTest } from './entities/definitive-drug-test.entity';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Injectable()
export class DefinitiveDrugTestsService {
  constructor(
    @InjectRepository(DefinitiveDrugTest)
    private definitiveRepository: Repository<DefinitiveDrugTest>,
    @InjectRepository(PreliminaryDrugTest)
    private preliminaryRepository: Repository<PreliminaryDrugTest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async create(
    createDto: CreateDefinitiveDrugTestDto,
    creatingUser: User,
  ): Promise<DefinitiveDrugTest> {
    const { preliminaryTestId, expertId, analysisResult, techniqueIds } = createDto;

    const preliminaryTest = await this.preliminaryRepository.findOneBy({ id: preliminaryTestId });
    if (!preliminaryTest) {
      throw new NotFoundException(`Exame preliminar com o ID "${preliminaryTestId}" não encontrado.`);
    }

    const existingDefinitive = await this.definitiveRepository.findOneBy({ preliminaryTest: { id: preliminaryTestId } });
    if (existingDefinitive) {
      throw new ConflictException(`Um exame definitivo já foi criado para este caso.`);
    }

    const expert = await this.userRepository.findOneBy({ id: expertId });
    if (!expert) {
      throw new NotFoundException(`Perito com ID "${expertId}" não encontrado.`);
    }

    let techniques: ExamType[] = [];
    if (techniqueIds && techniqueIds.length > 0) {
      techniques = await this.examTypeRepository.findBy({ id: In(techniqueIds) });
      if (techniques.length !== techniqueIds.length) {
        throw new NotFoundException('Uma ou mais técnicas informadas não foram encontradas.');
      }
    }

    const year = new Date().getFullYear();
    const prefix = 'QUIM'; // Assumindo prefixo para Química
    const countThisYear = await this.definitiveRepository.count({ where: { reportNumber: Like(`${prefix}-%-${year}`) } });
    const sequential = countThisYear + 1;
    const reportNumber = `${prefix}-${sequential}-${year}`;

    const newDefinitiveTest = this.definitiveRepository.create({
      preliminaryTest,
      expert,
      analysisResult,
      reportNumber,
      techniquesUsed: techniques,
      createdBy: creatingUser,
    });

    preliminaryTest.isLocked = true;
    preliminaryTest.lockedAt = new Date();
    preliminaryTest.lockedBy = creatingUser;

    await this.preliminaryRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(newDefinitiveTest);
      await transactionalEntityManager.save(preliminaryTest);
    });

    return newDefinitiveTest;
  }

  async findAll(): Promise<DefinitiveDrugTest[]> {
    return this.definitiveRepository.find({
      relations: ['preliminaryTest', 'expert', 'createdBy', 'techniquesUsed'],
    });
  }

  async findOne(id: string): Promise<DefinitiveDrugTest> {
    const definitiveTest = await this.definitiveRepository.findOne({
      where: { id },
      relations: ['preliminaryTest', 'expert', 'createdBy', 'techniquesUsed'],
    });
    if (!definitiveTest) {
      throw new NotFoundException(`Exame definitivo com o ID "${id}" não encontrado.`);
    }
    return definitiveTest;
  }

  async update(
    id: string,
    updateDto: UpdateDefinitiveDrugTestDto,
    currentUser: User,
  ): Promise<DefinitiveDrugTest> {
    const definitiveTest = await this.definitiveRepository.findOne({
      where: { id },
      relations: ['createdBy', 'techniquesUsed'], // Carrega as relações existentes
    });

    if (!definitiveTest) {
      throw new NotFoundException(`Exame definitivo com o ID "${id}" não encontrado.`);
    }

    const isOwner = definitiveTest.createdBy.id === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN;

    if (definitiveTest.isLocked && !isAdmin) {
      throw new ForbiddenException('Este registro está travado e não pode mais ser editado.');
    }

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para editar este registro.');
    }

    const { techniqueIds, ...definitiveData } = updateDto;
    const updatedTest = this.definitiveRepository.merge(definitiveTest, definitiveData);

    if (updateDto.expertId) {
      const expert = await this.userRepository.findOneBy({ id: updateDto.expertId });
      if (!expert) throw new NotFoundException(`Perito com ID "${updateDto.expertId}" não encontrado.`);
      updatedTest.expert = expert;
    }
    
    // Lógica para atualizar as técnicas
    if (techniqueIds) {
        const techniques = await this.examTypeRepository.findBy({ id: In(techniqueIds) });
        if (techniques.length !== techniqueIds.length) {
            throw new NotFoundException('Uma ou mais técnicas informadas na atualização não foram encontradas.');
        }
        updatedTest.techniquesUsed = techniques;
    }


    return this.definitiveRepository.save(updatedTest);
  }

  async remove(id: string): Promise<void> {
    const definitiveTest = await this.findOne(id);
    await this.definitiveRepository.softDelete(definitiveTest.id);
  }
  async uploadReport(id: string, file: any, currentUser: User): Promise<DefinitiveDrugTest> {
    const definitiveTest = await this.definitiveRepository.findOneBy({ id });
    if (!definitiveTest) {
      throw new NotFoundException(`Exame definitivo com o ID "${id}" não encontrado.`);
    }
    
    // A lógica de permissão (quem pode fazer upload) pode ser adicionada aqui

    // Chama o DocumentsService para fazer o upload, mas precisamos ajustar o uploadFile
    // para lidar com diferentes tipos de "casos".
    // Por enquanto, vamos simular. Precisaremos refatorar o DocumentsService.
    console.log('Simulando upload para o Exame Definitivo:', id);

    // TODO: Refatorar DocumentsService para ser mais genérico.
    // Por agora, vamos apenas retornar o objeto.
    return definitiveTest;
  }
}