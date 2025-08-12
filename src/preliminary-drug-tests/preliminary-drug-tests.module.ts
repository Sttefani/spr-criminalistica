// Arquivo: src/preliminary-drug-tests/preliminary-drug-tests.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreliminaryDrugTestsService } from './preliminary-drug-tests.service';
import { PreliminaryDrugTestsController } from './preliminary-drug-tests.controller';
import { PreliminaryDrugTest } from './entities/preliminary-drug-test.entity';
// Importe TODAS as entidades que o serviço precisa
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';
import { User } from 'src/users/entities/users.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PreliminaryDrugTest,
      Procedure,
      OccurrenceClassification,
      User,
      RequestingUnit,
      Authority,
      City,
      ForensicService,
    ]),
  ],
  controllers: [PreliminaryDrugTestsController], // <-- ADICIONE ESTA LINHA
  providers: [PreliminaryDrugTestsService]
  
})
export class PreliminaryDrugTestsModule {}