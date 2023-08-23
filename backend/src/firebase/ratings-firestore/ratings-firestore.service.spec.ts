import { Test, TestingModule } from '@nestjs/testing';
import { RatingsFirestoreService } from './ratings-firestore.service';

describe('RatingsFirestoreService', () => {
  let service: RatingsFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingsFirestoreService],
    }).compile();

    service = module.get<RatingsFirestoreService>(RatingsFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
