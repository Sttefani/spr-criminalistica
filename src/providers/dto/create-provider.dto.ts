import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do fornecedor é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  address: AddressDto;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  representativeName?: string;

  @IsString()
  @IsNotEmpty({ message: 'É obrigatório informar o que o fornecedor fornece.' })
  supplies: string;
}