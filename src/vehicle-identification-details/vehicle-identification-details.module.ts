import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleIdentificationDetailsService } from './vehicle-identification-details.service';
import { VehicleIdentificationDetailsController } from './vehicle-identification-details.controller';
import { VehicleIdentificationDetail } from './entities/vehicle-identification-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleIdentificationDetail,
      GeneralOccurrence,
      ExamType,
    ]),
  ],
  controllers: [VehicleIdentificationDetailsController],
  providers: [VehicleIdentificationDetailsService],
})
export class VehicleIdentificationDetailsModule {}