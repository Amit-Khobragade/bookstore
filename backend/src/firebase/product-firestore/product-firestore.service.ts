import { Injectable } from '@nestjs/common';
import { Product } from 'src/common/Product';
import { FirebaseService } from '../firebase.service';
import { Genre } from 'src/common/Book';

/* Structure of doc stored in 'product store'
 * doc_reference_id: pid // Auto generated
 * {
 *      title: string
 *      description: string   // upto 2000 characters
 *      genre: Genre[]
 *      images: url[]  // array of image urls
 *      price: Currency // must contain the denomination and the amount in number
 *      taxPercent: number // percent
 *      sellerID: string // seller's uid
 *      stockAddress: Address // address of the stock
 *      ISBN: bookid // bookid
 *      target_region: Country[] // countries available in
 *      stock: number // stock
 *      publisher: string //publisher's name
 *      publication_date: Date
 *      author: author_id       //author's id
 *      language: string // language
 *      book_length: string // number of pages
 *      age_restrictions: number
 *      dimensions: {
 *          length: number
 *          width: number
 *          height: number
 *      }
 *      categories: string[]
 *      other_properties: { string: [string] }
 * }
 */

@Injectable()
export class ProductFirestoreService {
  constructor(public firebaseService: FirebaseService) {}

  private getCollection() {
    return this.firebaseService.getProductCollection();
  }

  /**
   * it helps in finding document based on array of queries
   */
  private async queryHelper(
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
    ...args: [
      string | FirebaseFirestore.FieldPath,
      FirebaseFirestore.WhereFilterOp,
      any,
    ][]
  ): Promise<Product[]> {
    const productCollection = this.getCollection();
    for (const query of args) {
      productCollection.where(...query);
    }
    const readResults = await productCollection
      .limit(PRODUCTS_PER_PAGE)
      .offset((PAGE - 1) * PRODUCTS_PER_PAGE)
      .get();

    if (readResults.empty) {
      return [];
    }

    return readResults.docs.map((doc) =>
      Product.fromObject(doc.id, doc.data()),
    );
  }

  /**
   * it helps in updating a document
   *
   * Requires an pure callback function as an argument which is called if the
   * product exists.
   *
   * This funciton takes in the previous state and produces the new
   * product partial for updates
   *
   */
  private async updateHelper(
    pid: string,
    callback: (previousState: Product) => Partial<Product>,
  ) {
    const productCollection = this.getCollection();
    const product = await this.getProductById(pid);

    if (product) {
      const updates = callback(product);

      const writeResult = await productCollection.doc(pid).update(updates);

      return true;
    }
    return false;
  }

  /**
   * returns product by id
   */
  async getProductById(pid: string): Promise<Product | undefined> {
    const productCollection = this.getCollection();
    const product = await productCollection.doc(pid).get();

    if (product.exists) {
      return Product.fromObject(product.id, product.data());
    }
  }

  /**
   * finds products by ISBN
   *
   * returns array of products with the matching isbn
   */
  async getProductByISBN(
    isbn: string,
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
  ): Promise<Product[]> {
    return this.queryHelper(PAGE, PRODUCTS_PER_PAGE, ['ISBN', '==', isbn]);
  }

  /**
   * searches the store for `searchTerm` in the title\
   *
   * returns array of products
   */
  async searchTitle(
    searchTerm: string,
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
  ): Promise<Product[]> {
    return this.queryHelper(
      PAGE,
      PRODUCTS_PER_PAGE,
      ['title', '>=', searchTerm],
      ['title', '<=', searchTerm + '\uf8ff'],
    );
  }

  /**
   * finds the products by author
   *
   * returns array of products
   */
  async getProductsByAuthorID(
    author_id: string,
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
  ): Promise<Product[]> {
    return this.queryHelper(PAGE, PRODUCTS_PER_PAGE, [
      'author_id',
      '==',
      author_id,
    ]);
  }

  /**
   * finds the products by author
   *
   * returns array of products
   */
  async getProductByGenre(
    genre: Genre,
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
  ): Promise<Product[]> {
    return this.queryHelper(PAGE, PRODUCTS_PER_PAGE, ['genre', '==', genre]);
  }

  /**
   * finds the products by author
   *
   * returns array of products
   */
  async getProductByCategory(
    category: string,
    PAGE: number = 1,
    PRODUCTS_PER_PAGE: number = 25,
  ): Promise<Product[]> {
    return this.queryHelper(PAGE, PRODUCTS_PER_PAGE, [
      'categories',
      'array-contains',
      category,
    ]);
  }

  /**
   * appends the images
   *
   * returns boolean value depending on succesfull insertion
   */
  pushImages(pid: string, urls: string[]): Promise<boolean> {
    return this.updateHelper(pid, (product) => ({
      images: [...product.images, ...urls],
    }));
  }

  /**
   * removes images from index
   *
   * returns boolean value depending on succesfull updation
   */
  removeImageIndex(pid: string, index: number): Promise<boolean> {
    return this.updateHelper(pid, (product) => ({
      images: product.images.filter((_, pos) => pos !== index),
    }));
  }

  /**
   * reduces stock by `amount` which is set to 1 by default
   *
   * returns boolean value depending on succesfull updation
   */
  reduceStock(pid: string, amount: number = 1): Promise<boolean> {
    return this.updateHelper(pid, (product) => ({
      stock: product.stock - amount,
    }));
  }

  /**
   * updates stock to `amount`
   *
   * returns boolean value depending on succesfull updation
   */
  updateStock(pid: string, amount: number): Promise<boolean> {
    return this.updateHelper(pid, () => ({
      stock: amount,
    }));
  }

  /**
   * updates product
   *
   * returns boolean value depending on succesfull updation
   */
  updateProduct(pid: string, updates: Partial<Product>): Promise<boolean> {
    return this.updateHelper(pid, () => updates);
  }

  /**
   * deletes product
   *
   * returns boolean value depending on succesfull updation
   */
  async deleteProduct(pid: string): Promise<boolean> {
    const product = this.getCollection().doc(pid);

    if ((await product.get()).exists) {
      const writeResult = await product.delete();

      return true;
    }

    return false;
  }

  /**
   * creates product
   *
   * returns id of the created doc
   */
  async createProduct(product: Product): Promise<string> {
    const productCollection = this.getCollection();

    const createdProductDoc = await productCollection.add(
      product.toPureJsObject(),
    );

    return createdProductDoc.id;
  }
}
