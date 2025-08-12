import { Test, TestingModule } from '@nestjs/testing';
import { TrafficAccidentDetailsService } from './traffic-accident-details.service';

describe('TrafficAccidentDetailsService', () => {
  let service: TrafficAccidentDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficAccidentDetailsService],
    }).compile();

    service = module.get<TrafficAccidentDetailsService>(TrafficAccidentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
