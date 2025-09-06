/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccurrenceMovement } from './entities/occurrence-movement.entity';
import { OccurrenceMovementsService } from './occurrence-movements.service';
import { OccurrenceMovementsController } from './occurrence-movements.controller';
import { User } from '../users/entities/users.entity';
import { GeneralOccurrence } from '../general-occurrences/entities/general-occurrence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OccurrenceMovement,  // ← Principal entity do módulo
      User,                // ← Para injetar UserRepository
      GeneralOccurrence    // ← Para injetar GeneralOccurrenceRepository
    ])
  ],
  controllers: [OccurrenceMovementsController],
  providers: [OccurrenceMovementsService],
  exports: [OccurrenceMovementsService], // Para usar em outros módulos
})
export class OccurrenceMovementsModule {}