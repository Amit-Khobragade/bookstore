import { Test, TestingModule } from '@nestjs/testing';
import { AuthorFirestoreService } from './author-firestore.service';

describe('AuthorFirestoreService', () => {
  let service: AuthorFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorFirestoreService],
    }).compile();

    service = module.get<AuthorFirestoreService>(AuthorFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
