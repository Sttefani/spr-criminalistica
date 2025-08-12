// Arquivo: src/documents/documents.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User } from 'src/users/entities/users.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege todos os endpoints de documentos
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Endpoint para upload de um novo documento.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Diz ao NestJS para procurar um arquivo no campo 'file' da requisição
  uploadFile(
    // Extrai o arquivo da requisição
    @UploadedFile(
      // Valida o arquivo usando Pipes, assim como fazemos nos DTOs
      new ParseFilePipe({
        validators: [
          // 1. Valida o tamanho máximo do arquivo (aqui, 10 MB)
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), 
          // 2. Valida o tipo do arquivo (aqui, apenas PDF)
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: any, // Usamos 'any' aqui também para consistência com o service
    
    // Extrai o corpo da requisição (que conterá os dados do nosso DTO)
    @Body() createDocumentDto: CreateDocumentDto,
    
    // Pega o usuário logado
    @Req() req: any,
  ) {
    const uploadedBy: User = req.user;
    
    return this.documentsService.uploadFile(
      file,
      createDocumentDto.caseId,
      createDocumentDto.documentType,
      uploadedBy,
    );
  }
}