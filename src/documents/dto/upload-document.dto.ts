import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  relatedEntityId: string;

  @IsString()
  @IsNotEmpty()
  relatedEntityType: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;
}