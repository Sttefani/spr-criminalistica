// Arquivo: src/ballistics-details/ballistics-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BallisticsDetailsService } from './ballistics-details.service';
import { BallisticsDetailsController } from './ballistics-details.controller';
import { BallisticsDetail } from './entities/ballistics-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BallisticsDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [BallisticsDetailsController],
  providers: [BallisticsDetailsService],
})
export class BallisticsDetailsModule {}