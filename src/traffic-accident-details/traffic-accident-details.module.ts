import { Module } from '@nestjs/common';
import { TrafficAccidentDetailsService } from './traffic-accident-details.service';
import { TrafficAccidentDetailsController } from './traffic-accident-details.controller';

@Module({
  controllers: [TrafficAccidentDetailsController],
  providers: [TrafficAccidentDetailsService],
})
export class TrafficAccidentDetailsModule {}
