import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyItemsController } from './patrimony-items.controller';
import { PatrimonyItemsService } from './patrimony-items.service';

describe('PatrimonyItemsController', () => {
  let controller: PatrimonyItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonyItemsController],
      providers: [PatrimonyItemsService],
    }).compile();

    controller = module.get<PatrimonyItemsController>(PatrimonyItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
