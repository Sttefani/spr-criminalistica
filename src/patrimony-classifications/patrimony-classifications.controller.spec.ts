import { Test, TestingModule } from '@nestjs/testing';
import { PatrimonyClassificationsController } from './patrimony-classifications.controller';
import { PatrimonyClassificationsService } from './patrimony-classifications.service';

describe('PatrimonyClassificationsController', () => {
  let controller: PatrimonyClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatrimonyClassificationsController],
      providers: [PatrimonyClassificationsService],
    }).compile();

    controller = module.get<PatrimonyClassificationsController>(PatrimonyClassificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
