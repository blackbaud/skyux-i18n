/**
 * The formatting options for Currency + Locale.
 */
export interface SkyCurrencyFormat {
  /** The Locale */
  locale: string;
  /** The ISO 4217 Currency Code */
  isoCurrencyCode: string;
  /** The symbol */
  symbol: string;
  /** The symbol's location -- prefix or suffix? */
  symbolLocation: 'p' | 's';
  /** The fractional decimal character  */
  decimalCharacter: string;
  /** The grouping character (1,000) */
  groupCharacter: string;
  /** The numeric precision (decimal places) */
  precision: number;
}
