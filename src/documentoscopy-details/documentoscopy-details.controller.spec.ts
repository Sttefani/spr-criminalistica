import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoscopyDetailsController } from './documentoscopy-details.controller';
import { DocumentoscopyDetailsService } from './documentoscopy-details.service';

describe('DocumentoscopyDetailsController', () => {
  let controller: DocumentoscopyDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoscopyDetailsController],
      providers: [DocumentoscopyDetailsService],
    }).compile();

    controller = module.get<DocumentoscopyDetailsController>(DocumentoscopyDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
