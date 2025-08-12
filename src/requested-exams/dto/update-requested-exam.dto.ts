// Arquivo: src/requested-exams/dto/update-requested-exam.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { RequestedExamStatus } from '../entities/requested-exam.entity';
import { CreateRequestedExamDto } from './create-requested-exam.dto';

// Usamos o PartialType para herdar os campos opcionais de 'create'
export class UpdateRequestedExamDto extends PartialType(CreateRequestedExamDto) {
  // Adicionamos um campo extra para permitir a atualização do status
  @IsEnum(RequestedExamStatus, { message: 'O status fornecido é inválido.' })
  @IsOptional()
  status?: RequestedExamStatus;
}