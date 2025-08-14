import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoscopyDetailsService } from './documentoscopy-details.service';

describe('DocumentoscopyDetailsService', () => {
  let service: DocumentoscopyDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoscopyDetailsService],
    }).compile();

    service = module.get<DocumentoscopyDetailsService>(DocumentoscopyDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
