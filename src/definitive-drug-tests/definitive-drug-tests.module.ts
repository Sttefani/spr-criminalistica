// Arquivo: src/definitive-drug-tests/definitive-drug-tests.module.ts

import { Module } from '@nestjs/common';
import { DefinitiveDrugTestsService } from './definitive-drug-tests.service';
import { DefinitiveDrugTestsController } from './definitive-drug-tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefinitiveDrugTest } from './entities/definitive-drug-test.entity';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DefinitiveDrugTest,
      PreliminaryDrugTest,
      User,
      ExamType, 
    ]),
  ],
  controllers: [DefinitiveDrugTestsController],
  providers: [DefinitiveDrugTestsService],
})
export class DefinitiveDrugTestsModule {}