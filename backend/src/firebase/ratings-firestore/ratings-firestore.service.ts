import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class RatingsFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getRatingByBookAndUserId(bookId: string, userId: string) {
    const doc = await this.firebaseService
      .getRatingCollection()
      .doc(userId + bookId)
      .get();

    return doc.data();
  }

  async getRatingByBookId(bookId: string, page: number = 1, LIMIT: number = 5) {
    const docs = await this.firebaseService
      .getRatingCollection()
      .where('book_id', '==', bookId)
      .orderBy('date', 'desc')
      .offset((page - 1) * LIMIT)
      .limit(LIMIT)
      .get();

    return docs.docs.map((doc) => doc.data());
  }

  async createRating(rating) {
    const doc = this.firebaseService
      .getRatingCollection()
      .doc(rating.userId + rating.bookId);

    await doc.set(rating);

    return (await doc.get()).data();
  }

  async editRating(id: string, payload) {
    const doc = this.firebaseService.getRatingCollection().doc(id);

    await doc.update(payload);

    return;
  }
}
