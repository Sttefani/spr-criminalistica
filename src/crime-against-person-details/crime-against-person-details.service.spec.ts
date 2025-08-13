import { Test, TestingModule } from '@nestjs/testing';
import { CrimeAgainstPersonDetailsService } from './crime-against-person-details.service';

describe('CrimeAgainstPersonDetailsService', () => {
  let service: CrimeAgainstPersonDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrimeAgainstPersonDetailsService],
    }).compile();

    service = module.get<CrimeAgainstPersonDetailsService>(CrimeAgainstPersonDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
