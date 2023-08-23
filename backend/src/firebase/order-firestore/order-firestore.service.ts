import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class OrderFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getOrderById(id: string) {
    const doc = await this.firebaseService.getOrderCollection().doc(id).get();

    return await doc.data();
  }

  async getAllOrdersByUserId(userId: string) {
    const docs = await this.firebaseService
      .getOrderCollection()
      .where('userId', '==', userId)
      .get();

    return docs.docs;
  }

  async createOrder(order) {
    const doc = await this.firebaseService.getOrderCollection().add(order);

    return (await doc.get()).data();
  }

  async updateOrder(id: string, payload) {
    const doc = this.firebaseService.getOrderCollection().doc(id);

    await doc.update(payload);

    return this.getOrderById(id);
  }
}
