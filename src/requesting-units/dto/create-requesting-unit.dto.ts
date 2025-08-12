import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRequestingUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da unidade é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A sigla da unidade é obrigatória.' })
  @MaxLength(50, { message: 'A sigla pode ter no máximo 50 caracteres.'})
  acronym: string;
}