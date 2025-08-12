// Arquivo: src/exam-types/exam-types.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. IMPORTE
import { ExamTypesService } from './exam-types.service';
import { ExamTypesController } from './exam-types.controller';
import { ExamType } from './entities/exam-type.entity'; // 2. IMPORTE

@Module({
  imports: [TypeOrmModule.forFeature([ExamType])], // 3. ADICIONE ESTA LINHA
  controllers: [ExamTypesController],
  providers: [ExamTypesService],
})
export class ExamTypesModule {}