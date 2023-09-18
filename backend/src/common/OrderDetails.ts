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
