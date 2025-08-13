import { Test, TestingModule } from '@nestjs/testing';
import { GeneticComparisonDetailsController } from './genetic-comparison-details.controller';
import { GeneticComparisonDetailsService } from './genetic-comparison-details.service';

describe('GeneticComparisonDetailsController', () => {
  let controller: GeneticComparisonDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneticComparisonDetailsController],
      providers: [GeneticComparisonDetailsService],
    }).compile();

    controller = module.get<GeneticComparisonDetailsController>(GeneticComparisonDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
