/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da localização é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}