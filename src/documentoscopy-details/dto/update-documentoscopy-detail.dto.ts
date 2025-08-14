import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoscopyDetailDto } from './create-documentoscopy-detail.dto';

export class UpdateDocumentoscopyDetailDto extends PartialType(CreateDocumentoscopyDetailDto) {}
