import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class BookFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getBookById(id: string) {
    const doc = await this.firebaseService.getBookCollection().doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException();
    }

    return doc.data();
  }

  async searchBookByName(keyword: string, page: number = 1, LIMIT: number = 5) {
    const docs = await this.firebaseService
      .getBookCollection()
      .where('name', '==', keyword)
      .offset((page - 1) * LIMIT)
      .limit(LIMIT)
      .get();

    return docs.docs.map((doc) => doc.data());
  }

  async searchBookByAuthorId(
    authorID: string,
    page: number = 1,
    LIMIT: number = 5,
  ) {
    const docs = await this.firebaseService
      .getBookCollection()
      .where('authorId', '==', authorID)
      .offset((page - 1) * LIMIT)
      .limit(LIMIT)
      .get();

    return docs.docs.map((doc) => doc.data());
  }

  async createBook(book) {
    const doc = await this.firebaseService.getBookCollection().add(book);

    return (await doc.get()).data();
  }

  async updateBook(id: string, payload) {
    const doc = this.firebaseService.getBookCollection().doc(id);

    await doc.update(payload);

    return this.getBookById(id);
  }
}
