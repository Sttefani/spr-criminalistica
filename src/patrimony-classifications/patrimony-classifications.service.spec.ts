import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyClassificationsService } from './patrimony-classifications.service';

describe('PatrimonyClassificationsService', () => {
  let service: PatrimonyClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonyClassificationsService],
    }).compile();

    service = module.get<PatrimonyClassificationsService>(PatrimonyClassificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
