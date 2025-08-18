import { IsEnum, IsNotEmpty, IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class CreateDocumentDto {
  @IsString({ message: 'O nome original do arquivo deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome original do arquivo é obrigatório.' })
  originalName: string;

  @IsString({ message: 'A chave de armazenamento deve ser um texto.' })
  @IsNotEmpty({ message: 'A chave de armazenamento é obrigatória.' })
  storageKey: string;

  @IsString({ message: 'O tipo MIME deve ser um texto.' })
  @IsNotEmpty({ message: 'O tipo MIME é obrigatório.' })
  mimeType: string;

  @IsNumber({}, { message: 'O tamanho do arquivo deve ser um número.' })
  @Min(1, { message: 'O tamanho do arquivo deve ser maior que zero.' })
  @IsNotEmpty({ message: 'O tamanho do arquivo é obrigatório.' })
  size: number;

  @IsEnum(DocumentType, { message: 'O tipo de documento é inválido.' })
  @IsNotEmpty({ message: 'O tipo de documento é obrigatório.' })
  documentType: DocumentType;

  // --- IDs dos Relacionamentos Opcionais ---
  // A lógica do serviço garantirá que pelo menos um deles seja preenchido
  @IsUUID('4', { message: 'O ID da Ocorrência Geral é inválido.' })
  @IsOptional()
  generalOccurrenceId?: string;

  @IsUUID('4', { message: 'O ID do Exame Preliminar é inválido.' })
  @IsOptional()
  preliminaryDrugTestId?: string;
  
  @IsUUID('4', { message: 'O ID do Exame Definitivo é inválido.' })
  @IsOptional()
  definitiveDrugTestId?: string;

  @IsUUID('4', { message: 'O ID do Item Patrimonial é inválido.' })
  @IsOptional()
  patrimonyItemId?: string;

  // O ID do usuário que fez o upload
  @IsUUID('4', { message: 'O ID do usuário que fez o upload é inválido.' })
  @IsNotEmpty({ message: 'O usuário que fez o upload é obrigatório.' })
  uploadedById: string;
}