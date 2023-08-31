import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class UserFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserById(id: string) {
    const doc = await this.firebaseService.getUserCollection().doc(id).get();

    if (doc.exists) {
      return Object.assign({}, doc.data(), { id: doc.id });
    }
  }

  async getUserByEmail(email: string) {
    const doc = await this.firebaseService
      .getUserCollection()
      .where('email', '==', email)
      .get();

    const user = doc.docs.at(0);

    if (user) {
      return Object.assign({}, user.data(), { id: user.id });
    }
  }

  async createUser(user) {
    const doc = await this.firebaseService.getUserCollection().add(user);
    return (await doc.get()).data();
  }

  async updateUser(id: string, payload) {
    const doc = this.firebaseService.getUserCollection().doc(id);

    await doc.update(payload);

    return this.getUserById(id);
  }
}
