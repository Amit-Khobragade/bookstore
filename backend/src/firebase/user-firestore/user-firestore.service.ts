import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class UserFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserById(id: string) {
    const doc = await this.firebaseService.getUserCollection().doc(id).get();

    if (!doc.exists) {
      throw new InternalServerErrorException();
    }

    return doc.data();
  }

  async getUserByEmail(email: string) {
    const doc = await this.firebaseService
      .getUserCollection()
      .where('email', '==', email)
      .get();

    return doc.docs.at(0)?.data();
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
