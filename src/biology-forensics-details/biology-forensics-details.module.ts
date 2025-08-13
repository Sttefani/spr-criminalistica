// Arquivo: src/biology-forensics-details/biology-forensics-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiologyForensicsDetailsService } from './biology-forensics-details.service';
import { BiologyForensicsDetailsController } from './biology-forensics-details.controller';
import { BiologyForensicsDetail } from './entities/biology-forensics-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BiologyForensicsDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [BiologyForensicsDetailsController],
  providers: [BiologyForensicsDetailsService],
})
export class BiologyForensicsDetailsModule {}