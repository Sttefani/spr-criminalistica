/* eslint-disable prettier/prettier */
// Arquivo: src/general-occurrences/general-occurrences.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { GeneralOccurrencesController } from './general-occurrences.controller';
import { GeneralOccurrence } from './entities/general-occurrence.entity';
import { RequestedExamsModule } from 'src/requested-exams/requested-exams.module'; // Importa o módulo filho

// Importa todas as entidades que o GeneralOccurrencesService depende
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { User } from 'src/users/entities/users.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralOccurrence,
      Procedure,
      ForensicService,
      User,
      RequestingUnit,
      RequestedExamsModule,
      Authority,
      City,
      OccurrenceClassification,
    ]),
    RequestedExamsModule, // Adiciona o módulo de exames solicitados
  ],
  controllers: [GeneralOccurrencesController],
  providers: [GeneralOccurrencesService],
})
export class GeneralOccurrencesModule {}