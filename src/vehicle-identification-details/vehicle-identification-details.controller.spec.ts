import { Test, TestingModule } from '@nestjs/testing';
import { VehicleIdentificationDetailsController } from './vehicle-identification-details.controller';
import { VehicleIdentificationDetailsService } from './vehicle-identification-details.service';

describe('VehicleIdentificationDetailsController', () => {
  let controller: VehicleIdentificationDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleIdentificationDetailsController],
      providers: [VehicleIdentificationDetailsService],
    }).compile();

    controller = module.get<VehicleIdentificationDetailsController>(VehicleIdentificationDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
