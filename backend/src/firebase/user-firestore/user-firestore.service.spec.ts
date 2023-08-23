import { Test, TestingModule } from '@nestjs/testing';
import { UserFirestoreService } from './user-firestore.service';

describe('UserFirestoreService', () => {
  let service: UserFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFirestoreService],
    }).compile();

    service = module.get<UserFirestoreService>(UserFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
