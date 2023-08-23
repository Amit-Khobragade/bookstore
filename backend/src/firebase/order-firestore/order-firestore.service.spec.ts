import { Test, TestingModule } from '@nestjs/testing';
import { OrderFirestoreService } from './order-firestore.service';

describe('OrderFirestoreService', () => {
  let service: OrderFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderFirestoreService],
    }).compile();

    service = module.get<OrderFirestoreService>(OrderFirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
