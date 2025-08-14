import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyMovementsController } from './patrimony-movements.controller';
import { PatrimonyMovementsService } from './patrimony-movements.service';

describe('PatrimonyMovementsController', () => {
  let controller: PatrimonyMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonyMovementsController],
      providers: [PatrimonyMovementsService],
    }).compile();

    controller = module.get<PatrimonyMovementsController>(PatrimonyMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
