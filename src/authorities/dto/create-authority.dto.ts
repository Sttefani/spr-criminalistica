// Arquivo: src/authorities/dto/create-authority.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAuthorityDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da autoridade é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O título da autoridade é obrigatório.' })
  title: string;

  // Campo opcional para vincular a um usuário existente
  @IsUUID(undefined, { message: 'O ID do usuário deve ser um UUID válido.'})
  @IsOptional()
  userId?: string;
}