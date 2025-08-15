import { Test, TestingModule } from '@nestjs/testing';
import { MalfunctionReportsController } from './malfunction-reports.controller';
import { MalfunctionReportsService } from './malfunction-reports.service';

describe('MalfunctionReportsController', () => {
  let controller: MalfunctionReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MalfunctionReportsController],
      providers: [MalfunctionReportsService],
    }).compile();

    controller = module.get<MalfunctionReportsController>(MalfunctionReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
