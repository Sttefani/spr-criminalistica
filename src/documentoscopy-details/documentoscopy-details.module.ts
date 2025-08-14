// Arquivo: src/documentoscopy-details/documentoscopy-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoscopyDetailsService } from './documentoscopy-details.service';
import { DocumentoscopyDetailsController } from './documentoscopy-details.controller';
import { DocumentoscopyDetail } from './entities/documentoscopy-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentoscopyDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [DocumentoscopyDetailsController],
  providers: [DocumentoscopyDetailsService],
})
export class DocumentoscopyDetailsModule {}