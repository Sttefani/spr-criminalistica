import { Test, TestingModule } from '@nestjs/testing';
import { ComputerForensicsDetailsController } from './computer-forensics-details.controller';
import { ComputerForensicsDetailsService } from './computer-forensics-details.service';

describe('ComputerForensicsDetailsController', () => {
  let controller: ComputerForensicsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputerForensicsDetailsController],
      providers: [ComputerForensicsDetailsService],
    }).compile();

    controller = module.get<ComputerForensicsDetailsController>(ComputerForensicsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
