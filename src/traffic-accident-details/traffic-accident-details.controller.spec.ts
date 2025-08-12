import { Test, TestingModule } from '@nestjs/testing';
import { TrafficAccidentDetailsController } from './traffic-accident-details.controller';
import { TrafficAccidentDetailsService } from './traffic-accident-details.service';

describe('TrafficAccidentDetailsController', () => {
  let controller: TrafficAccidentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficAccidentDetailsController],
      providers: [TrafficAccidentDetailsService],
    }).compile();

    controller = module.get<TrafficAccidentDetailsController>(TrafficAccidentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
