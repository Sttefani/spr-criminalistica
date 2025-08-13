import { Test, TestingModule } from '@nestjs/testing';
import { BallisticsDetailsController } from './ballistics-details.controller';
import { BallisticsDetailsService } from './ballistics-details.service';

describe('BallisticsDetailsController', () => {
  let controller: BallisticsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BallisticsDetailsController],
      providers: [BallisticsDetailsService],
    }).compile();

    controller = module.get<BallisticsDetailsController>(BallisticsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
