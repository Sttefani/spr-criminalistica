import {
  Controller, Post, Body, UseGuards, Req, UploadedFile,
  UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
  Query, Get, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User } from 'src/users/entities/users.entity';
import { UploadDocumentDto } from './dto/upload-document.dto'; // Importa o DTO correto

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Lista todos os documentos de uma entidade específica.
   * Ex: GET /documents?entityId=uuid-da-ocorrencia
   */
  @Get()
  findAllByEntity(@Query('entityId') entityId: string) {
    if (!entityId) {
      throw new BadRequestException('O parâmetro de busca "entityId" é obrigatório.');
    }
    return this.documentsService.findAllByRelatedEntity(entityId);
  }

  /**
   * Endpoint genérico para upload de um novo documento.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          // A validação de tipo pode ser mais flexível se necessário
          // new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: any,
    
    @Body() uploadDto: UploadDocumentDto, // Usa o novo DTO
    
    @Req() req: any,
  ) {
    const uploadedBy: User = req.user;
    
    // Passa todos os 5 argumentos para o serviço
    return this.documentsService.uploadFile(
      file,
      uploadDto.relatedEntityId,
      uploadDto.relatedEntityType,
      uploadDto.documentType,
      uploadedBy,
    );
  }
}