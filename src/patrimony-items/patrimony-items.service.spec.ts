import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyItemsService } from './patrimony-items.service';

describe('PatrimonyItemsService', () => {
  let service: PatrimonyItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonyItemsService],
    }).compile();

    service = module.get<PatrimonyItemsService>(PatrimonyItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
