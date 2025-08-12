import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOccurrenceClassificationDto {
  @IsString()
  @IsNotEmpty({ message: 'O código é obrigatório.' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome da classificação é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional() // O grupo é opcional
  group?: string;
}