import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyMovementsService } from './patrimony-movements.service';

describe('PatrimonyMovementsService', () => {
  let service: PatrimonyMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrimonyMovementsService],
    }).compile();

    service = module.get<PatrimonyMovementsService>(PatrimonyMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
