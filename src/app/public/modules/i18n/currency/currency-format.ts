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
}
