import { Test, TestingModule } from '@nestjs/testing';
import { BookFirestoreService } from './book-firestore.service';

describe('BookFirestoreService', () => {
  let service: BookFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookFirestoreService],
    }).compile();

    service = module.get<BookFirestoreService>(BookFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
