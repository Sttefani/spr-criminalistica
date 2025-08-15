import { Test, TestingModule } from '@nestjs/testing';
import { MalfunctionReportsService } from './malfunction-reports.service';

describe('MalfunctionReportsService', () => {
  let service: MalfunctionReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MalfunctionReportsService],
    }).compile();

    service = module.get<MalfunctionReportsService>(MalfunctionReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
