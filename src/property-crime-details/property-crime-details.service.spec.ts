import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCrimeDetailsService } from './property-crime-details.service';

describe('PropertyCrimeDetailsService', () => {
  let service: PropertyCrimeDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyCrimeDetailsService],
    }).compile();

    service = module.get<PropertyCrimeDetailsService>(PropertyCrimeDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
