/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/users/dto/update-user.dto.ts

// eslint-disable-next-line prettier/prettier
import { IsString, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
// eslint-disable-next-line prettier/prettier
import { Transform } from 'class-transformer';
// eslint-disable-next-line prettier/prettier
import { UserRole } from '../enums/users-role.enum';
// eslint-disable-next-line prettier/prettier
import { UserStatus } from '../enums/users-status.enum';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  // eslint-disable-next-line prettier/prettier
  @IsPhoneNumber('BR', { message: 'O número de telefone informado é inválido.' })
  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : value))
  phone?: string;

  @IsString()
  @IsOptional()
  institution?: string;

  // --- ADICIONE ESTAS DUAS PROPRIEDADES ---
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}