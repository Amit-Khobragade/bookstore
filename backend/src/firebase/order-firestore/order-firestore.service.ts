import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { Order, OrderStatus } from 'src/common/OrderDetails';
import { Filter } from 'firebase-admin/firestore';

/* Structure of doc stored in 'order store'
 * doc_reference_id: order_id // Auto generated
 * {
 *    product: product_id
 *    quantity: number
 *    current_status: OrderStatus
 *    expected_delivery_date: Date
 *    isPaid: boolean
 *    sellerId: string
 *    userId: string
 *    address: Address
 * }
 */

@Injectable()
export class OrderFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  private getCollection() {
    return this.firebaseService.getOrderCollection();
  }

  /**
   * it helps in finding document based on array of queries
   */
  private async queryHelper(
    PAGE: number = 1,
    ORDERS_PER_PAGE: number = 25,
    ...queries: [
      string | FirebaseFirestore.FieldPath,
      FirebaseFirestore.WhereFilterOp,
      any,
    ][]
  ): Promise<Order[]> {
    const orderCollection = this.getCollection();

    const readResults = await orderCollection
      .where(Filter.and(...queries.map((query) => Filter.where(...query))))
      .limit(ORDERS_PER_PAGE)
      .offset((PAGE - 1) * ORDERS_PER_PAGE)
      .get();

    if (readResults.empty) {
      return [];
    }

    return readResults.docs.map((doc) => Order.fromObject(doc.id, doc.data()));
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
    orderId: string,
    callback: (previousState: Order) => Partial<Order>,
  ): Promise<boolean> {
    const orderCollection = this.getCollection();
    const order = await this.getOrderById(orderId);

    if (order) {
      const updates = callback(order);
      delete updates.id;

      orderCollection.doc(orderId).update(updates);
      return true;
    }

    return false;
  }

  /**
   * returns order by id
   */
  async getOrderById(id: string): Promise<Order | undefined> {
    const orderCollection = this.getCollection();
    const order = await orderCollection.doc(id).get();

    if (order.exists) {
      return Order.fromObject(order.id, order.data());
    }
  }

  /**
   * finds the orders by userID
   *
   * returns array of products
   */
  async getAllOrdersByUserId(
    userId: string,
    PAGE: number = 1,
    ORDERS_PER_PAGE: number = 25,
  ): Promise<Order[]> {
    return this.queryHelper(PAGE, ORDERS_PER_PAGE, ['userId', '==', userId]);
  }

  /**
   * finds the orders by sellerID
   *
   * returns array of products
   */
  async getAllOrdersBySellerId(
    sellerId: string,
    PAGE: number = 1,
    ORDERS_PER_PAGE: number = 25,
  ): Promise<Order[]> {
    return this.queryHelper(PAGE, ORDERS_PER_PAGE, [
      'sellerId',
      '==',
      sellerId,
    ]);
  }

  /**
   * updates `current_status`
   *
   * returns boolean value depending on succesfull updation
   */
  updateStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    return this.updateHelper(orderId, (_) => ({
      current_status: newStatus,
    }));
  }

  /**
   * updates `expected_delivery_date`
   *
   * returns boolean value depending on succesfull updation
   */
  updateExpectedDelivery(orderId: string, newDate: Date): Promise<boolean> {
    return this.updateHelper(orderId, (_) => ({
      expected_delivery_date: newDate,
    }));
  }

  /**
   * creates order
   *
   * returns id of the created doc
   */
  async createOrder(order: Order): Promise<string> {
    const orderCollection = this.getCollection();

    const orderObject = order.toPureJsObject();
    delete orderObject.id;

    const createdOrderDoc = await orderCollection.add(orderObject);

    return createdOrderDoc.id;
  }
}
