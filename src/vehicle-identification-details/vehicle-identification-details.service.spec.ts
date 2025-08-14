import { Test, TestingModule } from '@nestjs/testing';
import { VehicleIdentificationDetailsService } from './vehicle-identification-details.service';

describe('VehicleIdentificationDetailsService', () => {
  let service: VehicleIdentificationDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleIdentificationDetailsService],
    }).compile();

    service = module.get<VehicleIdentificationDetailsService>(VehicleIdentificationDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
