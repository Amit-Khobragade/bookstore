import { Genre } from './Book';
import { CountryCode } from './Country';
import { Currency } from './Currency';
import { Address } from './OrderDetails';

export class Product {
  constructor(
    public pid: string,
    public title: string,
    public description: string,
    public genre: Genre[],
    public images: string[],
    public price: Currency,
    public taxPercent: number,
    public sellerID: string,
    public stockAddress: Address,
    public ISBN: string,
    public target_region: CountryCode[],
    public stock: number = 0,
    public publisher: string,
    public publication_date: Date,
    public author_id: string,
    public language: string,
    public book_length: string,
    public age_restrictions: number,
    public dimensions: {
      length: number;
      width: number;
      height: number;
    },
    public categories: string[],
    public other_properties: { string: [string] },
  ) {}

  static fromObject(pid: string, other: any): Product {
    return new Product(
      pid,
      other.title,
      other.description,
      other.genre,
      other.images,
      new Currency(other.price.currency_code, other.price.displayAmount),
      other.taxPercent,
      other.sellerID,
      Address.fromObject(other.stockAddress),
      other.ISBN,
      other.target_region,
      other.stock,
      other.publisher,
      other.publication_date,
      other.author_id,
      other.language,
      other.book_length,
      other.age_restrictions,
      other.dimensions,
      other.categories,
      other.other_properties,
    );
  }

  toPureJsObject() {
    return Object.assign({}, this, {
      price: this.price.toPureJsObject(),
      stockAddress: this.stockAddress.toPureJsObject(),
    });
  }
}
