// Arquivo: src/requested-exams/requested-exams.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestedExamsService } from './requested-exams.service';
import { RequestedExamsController } from './requested-exams.controller';
import { RequestedExam } from './entities/requested-exam.entity';

// Importe TODAS as entidades relacionadas
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestedExam,
      // Registre TODAS as entidades aqui para que o serviço possa usá-las
      GeneralOccurrence,
      ExamType,
      User,
    ]),
  ],
  controllers: [RequestedExamsController],
  providers: [RequestedExamsService],
})
export class RequestedExamsModule {}