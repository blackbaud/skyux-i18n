import { Options as AutonumericOptions } from 'autonumeric';

/**
 * The formatting options for Currency + Locale.
 */
export class SkyCurrencyFormat {
  /** The Locale */
  public locale: string;
  /** The ISO 4217 Code */
  public isoCode: string;
  /** The symbol */
  public symbol: string;
  /** The symbol's location -- prefix or suffix? */
  public symbolLocation: 'p' | 's';
  /** The fractional decimal character  */
  public decimalCharacter: string;
  /** The grouping character (1,000) */
  public groupCharacter: string;
  /** The numeric precision / decimal places */
  public precision: number;

  constructor(data: Partial<SkyCurrencyFormat>) {
    this.locale = data.locale ?? '';
    this.isoCode = data.isoCode ?? '';
    this.symbol = data.symbol ?? '$';
    this.symbolLocation = data.symbolLocation ?? 'p';
    this.decimalCharacter = data.decimalCharacter ?? '.';
    this.groupCharacter = data.groupCharacter ?? ',';
    this.precision = data.precision ?? 2;
  }

  /**
   * Maps to Autonumeric options.
   * @param currencyFormat
   *
   * @see [skyux-autonumeric](https://github.com/blackbaud/skyux-autonumeric)
   * @see [AutoNumeric.js](http://autonumeric.org/guide)
   */
  public mapToSkyAutonumeric(): AutonumericOptions {
    const options: AutonumericOptions = {
      currencySymbol: this.symbol,
      currencySymbolPlacement: this.symbolLocation,
      decimalCharacter: this.decimalCharacter,
      decimalPlaces: this.precision,
      digitGroupSeparator: this.groupCharacter
    };

    // Autonumeric does not support the same character being used so override.
    if (options.decimalCharacter === options.digitGroupSeparator) {
      options.decimalCharacter = '.';
      options.digitGroupSeparator = ',';
    }

    return options;
  }
}
