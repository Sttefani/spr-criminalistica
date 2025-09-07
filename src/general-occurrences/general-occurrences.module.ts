/* eslint-disable prettier/prettier */
// Arquivo: src/general-occurrences/general-occurrences.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { GeneralOccurrencesController } from './general-occurrences.controller';
import { GeneralOccurrence } from './entities/general-occurrence.entity';

// Importa todas as entidades que o GeneralOccurrencesService depende
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { User } from 'src/users/entities/users.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralOccurrence,
      Procedure,
      ForensicService,
      User,
      RequestingUnit,
      ExamType,
      Authority,
      City,
      OccurrenceClassification,
    ]),
  ],
  controllers: [GeneralOccurrencesController],
  providers: [GeneralOccurrencesService],
})
export class GeneralOccurrencesModule {}