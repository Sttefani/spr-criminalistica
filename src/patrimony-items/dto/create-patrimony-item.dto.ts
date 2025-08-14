// Arquivo: src/patrimony-items/dto/create-patrimony-item.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { AcquisitionType } from '../enums/acquisition-type.enum';
import { ItemState } from '../enums/item-state.enum';
import { ItemOperationalStatus } from '../enums/item-operational-status.enum';

export class CreatePatrimonyItemDto {
  // O campo 'name' foi removido.
  // O campo 'description' agora é obrigatório.
  @IsString()
  @IsNotEmpty({ message: 'A descrição do item é obrigatória.' })
  description: string;
  
  // Adicionamos o ID da subcategoria
  @IsUUID('4', { message: 'O ID da subcategoria é inválido.' })
  @IsNotEmpty({ message: 'A subcategoria é obrigatória.' })
  subcategoryId: string;

  @IsString()
  @IsOptional()
  tombNumber?: string;

  @IsEnum(AcquisitionType, { message: 'O tipo de aquisição é inválido.' })
  @IsNotEmpty({ message: 'O tipo de aquisição é obrigatório.' })
  acquisitionType: AcquisitionType;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsEnum(ItemState, { message: 'O estado do item é inválido.' })
  @IsOptional()
  state?: ItemState;

  @IsEnum(ItemOperationalStatus, { message: 'O status do item é inválido.' })
  @IsOptional()
  operationalStatus?: ItemOperationalStatus;

  @IsUUID('4', { message: 'O ID da localização atual é inválido.' })
  @IsNotEmpty({ message: 'A localização atual é obrigatória.' })
  currentLocationId: string;

  @IsUUID('4', { message: 'O ID do responsável atual é inválido.' })
  @IsOptional()
  currentHolderId?: string;
}