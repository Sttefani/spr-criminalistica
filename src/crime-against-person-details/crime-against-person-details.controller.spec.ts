import { Test, TestingModule } from '@nestjs/testing';
import { CrimeAgainstPersonDetailsController } from './crime-against-person-details.controller';
import { CrimeAgainstPersonDetailsService } from './crime-against-person-details.service';

describe('CrimeAgainstPersonDetailsController', () => {
  let controller: CrimeAgainstPersonDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrimeAgainstPersonDetailsController],
      providers: [CrimeAgainstPersonDetailsService],
    }).compile();

    controller = module.get<CrimeAgainstPersonDetailsController>(CrimeAgainstPersonDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
