/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsDateString, IsObject } from 'class-validator';

export class CreateOccurrenceMovementDto {
  @IsUUID()
  @IsNotEmpty()
  occurrenceId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsOptional()
  @IsBoolean()
  wasExtended?: boolean;

  @IsOptional()
  @IsString()
  extensionJustification?: string;

  @IsOptional()
  @IsBoolean()
  isSystemGenerated?: boolean;

  @IsOptional()
  @IsObject()
  additionalData?: any;
}