import { Test, TestingModule } from '@nestjs/testing';
import { GeneticComparisonDetailsService } from './genetic-comparison-details.service';

describe('GeneticComparisonDetailsService', () => {
  let service: GeneticComparisonDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneticComparisonDetailsService],
    }).compile();

    service = module.get<GeneticComparisonDetailsService>(GeneticComparisonDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
