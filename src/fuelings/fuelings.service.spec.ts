import { Test, TestingModule } from '@nestjs/testing';
import { FuelingsService } from './fuelings.service';

describe('FuelingsService', () => {
  let service: FuelingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelingsService],
    }).compile();

    service = module.get<FuelingsService>(FuelingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
