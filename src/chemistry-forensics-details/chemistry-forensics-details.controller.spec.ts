import { Test, TestingModule } from '@nestjs/testing';
import { ChemistryForensicsDetailsController } from './chemistry-forensics-details.controller';
import { ChemistryForensicsDetailsService } from './chemistry-forensics-details.service';

describe('ChemistryForensicsDetailsController', () => {
  let controller: ChemistryForensicsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChemistryForensicsDetailsController],
      providers: [ChemistryForensicsDetailsService],
    }).compile();

    controller = module.get<ChemistryForensicsDetailsController>(ChemistryForensicsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
