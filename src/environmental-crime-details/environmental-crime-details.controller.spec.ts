import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentalCrimeDetailsController } from './environmental-crime-details.controller';
import { EnvironmentalCrimeDetailsService } from './environmental-crime-details.service';

describe('EnvironmentalCrimeDetailsController', () => {
  let controller: EnvironmentalCrimeDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentalCrimeDetailsController],
      providers: [EnvironmentalCrimeDetailsService],
    }).compile();

    controller = module.get<EnvironmentalCrimeDetailsController>(EnvironmentalCrimeDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
