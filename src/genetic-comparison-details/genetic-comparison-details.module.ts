// Arquivo: src/genetic-comparison-details/genetic-comparison-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneticComparisonDetailsService } from './genetic-comparison-details.service';
import { GeneticComparisonDetailsController } from './genetic-comparison-details.controller';
import { GeneticComparisonDetail } from './entities/genetic-comparison-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneticComparisonDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [GeneticComparisonDetailsController],
  providers: [GeneticComparisonDetailsService],
})
export class GeneticComparisonDetailsModule {}