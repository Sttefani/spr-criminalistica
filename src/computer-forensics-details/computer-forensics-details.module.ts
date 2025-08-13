// Arquivo: src/computer-forensics-details/computer-forensics-details.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerForensicsDetailsService } from './computer-forensics-details.service';
import { ComputerForensicsDetailsController } from './computer-forensics-details.controller';
import { ComputerForensicsDetail } from './entities/computer-forensics-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComputerForensicsDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [ComputerForensicsDetailsController],
  providers: [ComputerForensicsDetailsService],
})
export class ComputerForensicsDetailsModule {}