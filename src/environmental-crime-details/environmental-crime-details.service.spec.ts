import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentalCrimeDetailsService } from './environmental-crime-details.service';

describe('EnvironmentalCrimeDetailsService', () => {
  let service: EnvironmentalCrimeDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentalCrimeDetailsService],
    }).compile();

    service = module.get<EnvironmentalCrimeDetailsService>(EnvironmentalCrimeDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
