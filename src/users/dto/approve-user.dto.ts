import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/users-role.enum';

export class ApproveUserDto {
  @IsEnum(UserRole, { message: 'A permissão (role) fornecida é inválida.' })
  @IsNotEmpty({ message: 'A permissão (role) é obrigatória.' })
  role: UserRole;
}