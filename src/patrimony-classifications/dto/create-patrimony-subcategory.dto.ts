import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePatrimonySubcategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da subcategoria é obrigatório.' })
  name: string;

  @IsUUID('4', { message: 'O ID da categoria é inválido.' })
  @IsNotEmpty({ message: 'É obrigatório informar a qual categoria esta subcategoria pertence.' })
  categoryId: string;
}