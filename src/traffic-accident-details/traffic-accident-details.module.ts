import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficAccidentDetailsService } from './traffic-accident-details.service';
import { TrafficAccidentDetailsController } from './traffic-accident-details.controller';
import { TrafficAccidentDetail } from './entities/traffic-accident-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity'; // 1. IMPORTE

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrafficAccidentDetail,
      GeneralOccurrence, // 2. ADICIONE AQUI
    ]),
  ],
  controllers: [TrafficAccidentDetailsController],
  providers: [TrafficAccidentDetailsService],
})
export class TrafficAccidentDetailsModule {}
