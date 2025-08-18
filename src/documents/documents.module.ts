import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { MinioClientProvider } from 'src/config/minio-client.config';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { DefinitiveDrugTest } from 'src/definitive-drug-tests/entities/definitive-drug-test.entity';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, GeneralOccurrence,
      PreliminaryDrugTest,
      DefinitiveDrugTest,
      PatrimonyItem,])], // Apenas a entidade Document
  controllers: [DocumentsController],
  providers: [DocumentsService, MinioClientProvider],
  exports: [DocumentsService],
})
export class DocumentsModule {}