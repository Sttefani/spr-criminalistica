// Arquivo: src/patrimony-movements/dto/create-patrimony-movement.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MovementType } from '../enums/movement-type.enum';

export class CreatePatrimonyMovementDto {
  @IsUUID('4', { message: 'O ID do item patrimonial é inválido.' })
  @IsNotEmpty({ message: 'O item patrimonial é obrigatório.' })
  patrimonyItemId: string;

  @IsEnum(MovementType, { message: 'O tipo de movimentação é inválido.' })
  @IsNotEmpty({ message: 'O tipo de movimentação é obrigatório.' })
  type: MovementType;

  @IsString()
  @IsOptional()
  notes?: string;

  // O destino é opcional, pois uma 'BAIXA' pode não ter destino.
  @IsUUID('4', { message: 'O ID da localização de destino é inválido.' })
  @IsOptional()
  toLocationId?: string;

  @IsUUID('4', { message: 'O ID do usuário de destino é inválido.' })
  @IsOptional()
  toUserId?: string;
}