import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendToLabDto {
  @IsUUID(undefined, { message: 'O ID do serviço pericial é inválido.' })
  @IsNotEmpty({ message: 'O serviço pericial é obrigatório.' })
  forensicServiceId: string;
}