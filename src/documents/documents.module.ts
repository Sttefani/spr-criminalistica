import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { MinioClientProvider } from 'src/config/minio-client.config';

@Module({
  imports: [TypeOrmModule.forFeature([Document])], // Apenas a entidade Document
  controllers: [DocumentsController],
  providers: [DocumentsService, MinioClientProvider],
  exports: [DocumentsService],
})
export class DocumentsModule {}