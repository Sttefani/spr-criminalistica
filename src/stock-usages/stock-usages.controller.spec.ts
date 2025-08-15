import { Test, TestingModule } from '@nestjs/testing';
import { StockUsagesController } from './stock-usages.controller';
import { StockUsagesService } from './stock-usages.service';

describe('StockUsagesController', () => {
  let controller: StockUsagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockUsagesController],
      providers: [StockUsagesService],
    }).compile();

    controller = module.get<StockUsagesController>(StockUsagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
