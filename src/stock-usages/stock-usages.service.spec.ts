import { Test, TestingModule } from '@nestjs/testing';
import { StockUsagesService } from './stock-usages.service';

describe('StockUsagesService', () => {
  let service: StockUsagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockUsagesService],
    }).compile();

    service = module.get<StockUsagesService>(StockUsagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
