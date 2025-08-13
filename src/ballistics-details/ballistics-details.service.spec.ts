import { Test, TestingModule } from '@nestjs/testing';
import { BallisticsDetailsService } from './ballistics-details.service';

describe('BallisticsDetailsService', () => {
  let service: BallisticsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BallisticsDetailsService],
    }).compile();

    service = module.get<BallisticsDetailsService>(BallisticsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
