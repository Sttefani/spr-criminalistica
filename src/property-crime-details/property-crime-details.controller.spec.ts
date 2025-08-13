import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCrimeDetailsController } from './property-crime-details.controller';
import { PropertyCrimeDetailsService } from './property-crime-details.service';

describe('PropertyCrimeDetailsController', () => {
  let controller: PropertyCrimeDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyCrimeDetailsController],
      providers: [PropertyCrimeDetailsService],
    }).compile();

    controller = module.get<PropertyCrimeDetailsController>(PropertyCrimeDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
