import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOccurrenceClassificationDto } from './dto/create-occurrence-classification.dto';
import { UpdateOccurrenceClassificationDto } from './dto/update-occurrence-classification.dto';
import { OccurrenceClassification } from './entities/occurrence-classification.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from '../users/entities/users.entity';

@Injectable()
export class OccurrenceClassificationsService {
  constructor(
    @InjectRepository(OccurrenceClassification)
    private classificationsRepository: Repository<OccurrenceClassification>,
  ) {}

  async create(createDto: CreateOccurrenceClassificationDto): Promise<OccurrenceClassification> {
    try {
      const classification = this.classificationsRepository.create(createDto);
      return await this.classificationsRepository.save(classification);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma classificação com este código já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<OccurrenceClassification[]> {
    return this.classificationsRepository.find();
  }

  async findOne(id: string): Promise<OccurrenceClassification> {
    const classification = await this.classificationsRepository.findOneBy({ id });
    if (!classification) {
      throw new NotFoundException(`Classificação com o ID "${id}" não encontrada.`);
    }
    return classification;
  }

  async update(id: string, updateDto: UpdateOccurrenceClassificationDto): Promise<OccurrenceClassification> {
    const classification = await this.classificationsRepository.preload({ id, ...updateDto });
    if (!classification) {
      throw new NotFoundException(`Classificação com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.classificationsRepository.save(classification);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma classificação com este código já existe.');
      }
      throw error;
    }
  }

  async remove(id: string, currentUser: User): Promise<void> {
  // 1. Verifica se o usuário tem a permissão necessária.
  if (currentUser.role !== UserRole.SUPER_ADMIN) {
    throw new ForbiddenException('Você não tem permissão para apagar registros.');
  }

  // 2. Reutiliza o método findOne para garantir que a classificação existe.
  // Se não existir, o findOne já lançará um NotFoundException.
  const classification = await this.findOne(id);

  // 3. Executa o soft delete no registro encontrado.
  await this.classificationsRepository.softDelete(classification.id);
}
}