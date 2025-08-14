// Arquivo: src/environmental-crime-details/environmental-crime-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentalCrimeDetailsService } from './environmental-crime-details.service';
import { EnvironmentalCrimeDetailsController } from './environmental-crime-details.controller';
import { EnvironmentalCrimeDetail } from './entities/environmental-crime-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EnvironmentalCrimeDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [EnvironmentalCrimeDetailsController],
  providers: [EnvironmentalCrimeDetailsService],
})
export class EnvironmentalCrimeDetailsModule {}