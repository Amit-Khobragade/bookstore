import { Test, TestingModule } from '@nestjs/testing';
import { ProductFirestoreService } from './product-firestore.service';

describe('ProductFirestoreService', () => {
  let service: ProductFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFirestoreService],
    }).compile();

    service = module.get<ProductFirestoreService>(ProductFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
