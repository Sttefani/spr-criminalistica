import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonySubcategoriesService } from './patrimony-subcategories.service';

describe('PatrimonySubcategoriesService', () => {
  let service: PatrimonySubcategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonySubcategoriesService],
    }).compile();

    service = module.get<PatrimonySubcategoriesService>(PatrimonySubcategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
