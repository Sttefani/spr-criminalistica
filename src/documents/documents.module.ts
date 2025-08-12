
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { MinioClientProvider } from 'src/config/minio-client.config'; // 1. IMPORTE
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, PreliminaryDrugTest,])],
  controllers: [DocumentsController],
  providers: [DocumentsService, MinioClientProvider], // 2. ADICIONE AQUI
})
export class DocumentsModule {}