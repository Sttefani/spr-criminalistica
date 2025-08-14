import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonySubcategoriesController } from './patrimony-subcategories.controller';

describe('PatrimonySubcategoriesController', () => {
  let controller: PatrimonySubcategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonySubcategoriesController],
    }).compile();

    controller = module.get<PatrimonySubcategoriesController>(PatrimonySubcategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
