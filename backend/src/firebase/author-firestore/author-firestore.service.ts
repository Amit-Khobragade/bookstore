import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { Author } from 'src/common/Author';

/* Structure of doc stored in 'author store'
 * doc_reference_id: author_id // Auto generated
 * {
 *    name: string
 *    photo: url
 *    about: string // upto 400 characters
 * }
 */

@Injectable()
export class AuthorFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  private getCollection() {
    return this.firebaseService.getAuthorCollection();
  }

  /**
   * returns author by id
   */
  async getAuthorById(id: string): Promise<Author | undefined> {
    const authorCollection = this.getCollection();
    const author = await authorCollection.doc(id).get();

    if (author.exists) {
      return Author.fromObject(author.id, author.data());
    }
  }

  /**
   * searches the author store for `keyword` in the name
   *
   * returns array of authors
   */
  async searchAuthorByName(
    keyword: string,
    PAGE: number = 1,
    LIMIT: number = 25,
  ): Promise<Author[]> {
    const authorCollection = this.getCollection();
    const authors = await authorCollection
      .where('name', '>=', keyword)
      .where('name', '<=', keyword + '\uf8ff')
      .offset((PAGE - 1) * LIMIT)
      .limit(LIMIT)
      .get();

    if (authors.empty) {
      return [];
    }

    return authors.docs.map((doc) => Author.fromObject(doc.id, doc.data()));
  }

  /**
   * creates author
   *
   * returns id of the created doc
   */
  async createAuthor(author: Author): Promise<string> {
    const authorCollection = await this.getCollection();

    const authorObject = author.toPureJsObject();
    delete authorObject.author_id;

    const createdAuthorDoc = await authorCollection.add(author);

    return createdAuthorDoc.id;
  }

  /**
   * deletes author
   *
   * returns boolean value depending on succesfull deletion
   */
  async deleteAuthor(id: string) {
    const authorCollection = this.getCollection();
    const authorDoc = authorCollection.doc(id);

    if ((await authorDoc.get()).exists) {
      const writeResult = await authorDoc.delete();

      return true;
    }
    return false;
  }
}
