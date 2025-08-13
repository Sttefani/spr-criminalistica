// Arquivo: src/common/dto/address.dto.ts

import { IsString, IsOptional, IsLatitude, IsLongitude } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  street?: string;
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  referencePoint?: string;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;
}