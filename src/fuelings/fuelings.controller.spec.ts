import { Test, TestingModule } from '@nestjs/testing';
import { FuelingsController } from './fuelings.controller';
import { FuelingsService } from './fuelings.service';

describe('FuelingsController', () => {
  let controller: FuelingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelingsController],
      providers: [FuelingsService],
    }).compile();

    controller = module.get<FuelingsController>(FuelingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
