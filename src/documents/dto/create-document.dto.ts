// Arquivo: src/documents/dto/create-document.dto.ts

import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class CreateDocumentDto {
  @IsUUID(undefined, { message: 'O ID do caso é inválido.' })
  @IsNotEmpty({ message: 'O ID do caso é obrigatório.' })
  caseId: string;

  @IsEnum(DocumentType, { message: 'O tipo de documento é inválido.' })
  @IsNotEmpty({ message: 'O tipo de documento é obrigatório.' })
  documentType: DocumentType;
}