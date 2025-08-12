// File: src/cities/dto/create-city.dto.ts

import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da cidade é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O Estado é obrigatório.' })
  @Length(2, 2, { message: 'Deve ter exatamente dois caractéres (e.g., RR).' })
  state: string;
}