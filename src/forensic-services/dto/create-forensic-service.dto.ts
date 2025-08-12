// Arquivo: src/forensic-services/dto/create-forensic-service.dto.ts

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateForensicServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A sigla do serviço é obrigatória.' })
  @MaxLength(50, { message: 'A sigla pode ter no máximo 50 caracteres.' })
  acronym: string;
}