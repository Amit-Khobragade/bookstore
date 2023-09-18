// prettier-ignore
export enum CurrencyCode {
    "AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLE","SLL","SOS","SRD","SSP","STN","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","UYI","UYU","UYW","UZS","VED","VES","VND","VUV","WST","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XDR","XOF","XPD","XPF","XPT","XSU","XTS","XUA","XXX","YER","ZAR","ZMW","ZWL"
}

/**
 * Class stores the currency in two parts
 * firstly it stores the currency as a integer value without devimal places in amount.
 * secondly it stores the decimal places as the number of places from the end to place decimal
 * lastly it stores the value of the above in a display string to ensure that price is not affected by how floating point integers are stored
 *
 * For ex:
 *
 *    amount = 999;
 *
 *    decimalPlaces = 2;
 *
 *    displayString = amount / decimalPlaces = '9.99';
 */
export class Currency {
  private readonly amount: number;
  private readonly decimalPlaces: number;
  public readonly displayAmount: string;

  constructor(
    currency_code: CurrencyCode,
    amount: number,
    decimalPlaces?: number,
  );
  constructor(currency_code: CurrencyCode, displayAmount: string);
  constructor(
    public readonly currency_code: CurrencyCode,
    ...args
  ) {
    if (Number.isSafeInteger(args[1])) {
      this.amount = args[1];
      this.decimalPlaces = args[2] ?? 2;

      const amountStr = this.amount.toFixed(0);
      const decimalPosition = amountStr.length - this.decimalPlaces;
      this.displayAmount =
        amountStr.substring(0, decimalPosition) +
        '.' +
        amountStr.substring(decimalPosition);
    } else {
      this.displayAmount = args[1];
      const decimalPosition = this.displayAmount.indexOf('.');
      this.decimalPlaces =
        decimalPosition === -1
          ? 0
          : this.displayAmount.length - decimalPosition;
      this.amount = Number.parseInt(this.displayAmount.replace('.', ''));
    }
  }

  discount(percent: number): Currency {
    const multiplier = percent / 100;

    return new Currency(
      this.currency_code,
      this.amount - this.amount * multiplier,
      this.decimalPlaces,
    );
  }

  subract(other: Currency): Currency {
    if (this.currency_code !== other.currency_code) {
      throw new Error("Currency Codes don't match");
    }

    let difference = 0;
    let decimalPlaces = this.decimalPlaces;
    let decimalDifference = this.decimalPlaces - other.decimalPlaces;

    if (decimalDifference === 0) {
      difference = this.amount - other.amount;
    } else if (decimalDifference > 0) {
      difference = this.amount - other.amount * 10 ** decimalDifference;
    } else {
      difference =
        this.amount * 10 ** Math.abs(decimalDifference) - other.amount;
      decimalPlaces = other.decimalPlaces;
    }

    return new Currency(this.currency_code, difference, decimalPlaces);
  }

  add(other: Currency): Currency {
    if (this.currency_code !== other.currency_code) {
      throw new Error("Currency Codes don't match");
    }

    let sum = 0;
    let decimalPlaces = this.decimalPlaces;
    let decimalDifference = this.decimalPlaces - other.decimalPlaces;

    if (decimalDifference === 0) {
      sum = this.amount + other.amount;
    } else if (decimalDifference > 0) {
      sum = this.amount + other.amount * 10 ** decimalDifference;
    } else {
      sum = this.amount * 10 ** Math.abs(decimalDifference) + other.amount;
      decimalPlaces = other.decimalPlaces;
    }

    return new Currency(this.currency_code, sum, decimalPlaces);
  }

  multiply(multiplier: number) {
    if (!Number.isSafeInteger) {
      throw Error('Invalid multiplier');
    }

    return new Currency(
      this.currency_code,
      this.amount * multiplier,
      this.decimalPlaces,
    );
  }

  toPureJsObject() {
    return {
      currency_code: this.currency_code,
      displayAmount: this.displayAmount,
    };
  }
}
