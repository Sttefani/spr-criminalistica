import { Test, TestingModule } from '@nestjs/testing';
import { ComputerForensicsDetailsService } from './computer-forensics-details.service';

describe('ComputerForensicsDetailsService', () => {
  let service: ComputerForensicsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComputerForensicsDetailsService],
    }).compile();

    service = module.get<ComputerForensicsDetailsService>(ComputerForensicsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
