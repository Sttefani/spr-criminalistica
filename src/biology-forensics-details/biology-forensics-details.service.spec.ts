import { Test, TestingModule } from '@nestjs/testing';
import { BiologyForensicsDetailsService } from './biology-forensics-details.service';

describe('BiologyForensicsDetailsService', () => {
  let service: BiologyForensicsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiologyForensicsDetailsService],
    }).compile();

    service = module.get<BiologyForensicsDetailsService>(BiologyForensicsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
