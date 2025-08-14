import { Test, TestingModule } from '@nestjs/testing';
import { ChemistryForensicsDetailsService } from './chemistry-forensics-details.service';

describe('ChemistryForensicsDetailsService', () => {
  let service: ChemistryForensicsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChemistryForensicsDetailsService],
    }).compile();

    service = module.get<ChemistryForensicsDetailsService>(ChemistryForensicsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
