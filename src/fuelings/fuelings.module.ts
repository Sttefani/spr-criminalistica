// Arquivo: src/fuelings/fuelings.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelingsService } from './fuelings.service';
import { FuelingsController } from './fuelings.controller';
import { Fueling } from './entities/fueling.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fueling,
      Vehicle,
      User,
    ]),
  ],
  controllers: [FuelingsController],
  providers: [FuelingsService],
})
export class FuelingsModule {}