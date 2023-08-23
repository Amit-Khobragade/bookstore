import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class AuthorFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  async getAuthorById(id: string) {
    const doc = await this.firebaseService.getAuthorCollection().doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException();
    }

    return doc.data();
  }

  async searchAuthorByName(
    keyword: string,
    page: number = 1,
    LIMIT: number = 5,
  ) {
    const docs = await this.firebaseService
      .getAuthorCollection()
      .where('name', '==', keyword)
      .offset((page - 1) * LIMIT)
      .limit(LIMIT)
      .get();

    return docs.docs.map((doc) => doc.data());
  }

  async createAuthor(author) {
    const doc = await this.firebaseService.getAuthorCollection().add(author);

    return (await doc.get()).data();
  }

  async updateBook(id: string, payload) {
    const doc = this.firebaseService.getAuthorCollection().doc(id);

    await doc.update(payload);

    return this.getAuthorById(id);
  }
}
