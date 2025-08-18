// Arquivo: src/documents/documents.controller.ts

import {
  Controller, Get, Post, Body, UseGuards, Req,
  UploadedFile, UseInterceptors, Query, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User } from 'src/users/entities/users.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Lista todos os documentos de uma entidade "pai" específica.
   * Ex: GET /documents?parentId=uuid-da-ocorrencia
   */
  @Get()
  findAllByParent(@Query('parentId') parentId: string) {
    if (!parentId) {
      throw new BadRequestException('O parâmetro de busca "parentId" é obrigatório.');
    }
    return this.documentsService.findAllByParent(parentId);
  }

  /**
   * Endpoint genérico para upload de um novo documento.
   * O frontend envia o arquivo e os metadados (parentId, parentType, documentType).
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: any,
    @Body() uploadDto: UploadDocumentDto, // Usa o nosso DTO para validar os metadados
    @Req() req: any,
  ) {
    const currentUser: User = req.user;
    
    // Repassa todos os dados para o serviço
    return this.documentsService.uploadFile(
      file,
      uploadDto.parentId,
      uploadDto.parentType,
      uploadDto.documentType,
      currentUser,
    );
  }
}