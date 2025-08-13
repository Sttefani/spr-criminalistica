import { Test, TestingModule } from '@nestjs/testing';
import { BiologyForensicsDetailsController } from './biology-forensics-details.controller';
import { BiologyForensicsDetailsService } from './biology-forensics-details.service';

describe('BiologyForensicsDetailsController', () => {
  let controller: BiologyForensicsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiologyForensicsDetailsController],
      providers: [BiologyForensicsDetailsService],
    }).compile();

    controller = module.get<BiologyForensicsDetailsController>(BiologyForensicsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
