import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationFirestoreService } from './application-firestore.service';

describe('ApplicationFirestoreService', () => {
  let service: ApplicationFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationFirestoreService],
    }).compile();

    service = module.get<ApplicationFirestoreService>(ApplicationFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
