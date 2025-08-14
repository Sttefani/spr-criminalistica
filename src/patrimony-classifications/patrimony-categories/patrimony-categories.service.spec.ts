import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyCategoriesService } from './patrimony-categories.service';

describe('PatrimonyCategoriesService', () => {
  let service: PatrimonyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonyCategoriesService],
    }).compile();

    service = module.get<PatrimonyCategoriesService>(PatrimonyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
