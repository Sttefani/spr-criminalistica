// Arquivo: src/property-crime-details/property-crime-details.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCrimeDetailsService } from './property-crime-details.service';
import { PropertyCrimeDetailsController } from './property-crime-details.controller';
import { PropertyCrimeDetail } from './entities/property-crime-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity'; // 1. IMPORTE

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyCrimeDetail,
      GeneralOccurrence, // 2. ADICIONE AQUI
    ]),
  ],
  controllers: [PropertyCrimeDetailsController],
  providers: [PropertyCrimeDetailsService],
})
export class PropertyCrimeDetailsModule {}