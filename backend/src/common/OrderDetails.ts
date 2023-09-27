export class Address {
  constructor(
    public readonly streetAddress: string,
    public readonly houseNo: number,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly pincode: string,
  ) {}

  static fromObject(other: any): Address {
    return new Address(
      other.streetAddress,
      other.houseNo,
      other.city,
      other.state,
      other.country,
      other.pincode,
    );
  }

  toPureJsObject() {
    return Object.assign({}, this);
  }
}

export enum OrderStatus {
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'RECIEVED',
  'CANCELLED',
}

export class Order {
  constructor(
    public id: string,
    public product: string,
    public quantity: number,
    public current_status: OrderStatus,
    public isPaid: boolean,
    public sellerId: string,
    public userId: string,
    public address: Address,
    public expected_delivery_date: Date,
  ) {}

  static fromObject(id: string, other: any): Order {
    return new Order(
      id,
      other.product,
      other.quantity,
      other.current_status,
      other.isPaid,
      other.sellerId,
      other.userId,
      Address.fromObject(other.address),
      other.expected_delivery_date,
    );
  }

  toPureJsObject() {
    return Object.assign({}, this, { address: this.address.toPureJsObject() });
  }
}
