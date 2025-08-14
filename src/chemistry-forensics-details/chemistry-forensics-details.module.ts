// Arquivo: src/chemistry-forensics-details/chemistry-forensics-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChemistryForensicsDetailsService } from './chemistry-forensics-details.service';
import { ChemistryForensicsDetailsController } from './chemistry-forensics-details.controller';
import { ChemistryForensicsDetail } from './entities/chemistry-forensics-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChemistryForensicsDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [ChemistryForensicsDetailsController],
  providers: [ChemistryForensicsDetailsService],
})
export class ChemistryForensicsDetailsModule {}