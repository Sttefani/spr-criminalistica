import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyCategoriesController } from './patrimony-categories.controller';

describe('PatrimonyCategoriesController', () => {
  let controller: PatrimonyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonyCategoriesController],
    }).compile();

    controller = module.get<PatrimonyCategoriesController>(PatrimonyCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
