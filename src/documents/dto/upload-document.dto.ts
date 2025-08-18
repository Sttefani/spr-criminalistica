// Arquivo: src/documents/dto/upload-document.dto.ts

import { IsEnum, IsNotEmpty, IsString, IsIn } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

const validParentTypes = [
  'GeneralOccurrence',
  'PreliminaryDrugTest',
  'DefinitiveDrugTest',
  'PatrimonyItem',
];

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID da entidade pai é obrigatório.'})
  parentId: string;

  @IsIn(validParentTypes, { message: 'O tipo da entidade pai é inválido.'})
  @IsNotEmpty({ message: 'O tipo da entidade pai é obrigatório.'})
  parentType: 'GeneralOccurrence' | 'PreliminaryDrugTest' | 'DefinitiveDrugTest' | 'PatrimonyItem';

  @IsEnum(DocumentType, { message: 'O tipo de documento é inválido.'})
  @IsNotEmpty({ message: 'O tipo de documento é obrigatório.'})
  documentType: DocumentType;
}