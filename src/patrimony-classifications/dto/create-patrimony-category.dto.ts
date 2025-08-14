import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePatrimonyCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório.' })
  name: string;
}