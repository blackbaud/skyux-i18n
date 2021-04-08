import {
  Injectable
} from '@angular/core';

import {
  SkyCurrencyFormat, SkyCurrencySymbolLocation
} from './currency-format';

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_GROUP_CHARACTER = ',';
const DEFAULT_DECIMAL_CHARACTER = '.';

/**
 * Service to get a currency's format given an iso code.
 */
@Injectable({
  providedIn: 'root'
})
export class SkyCurrencyFormatService {

  /**
   * Gets a currency's format.
   * @param isoCurrencyCode the ISO 4217 Currency Code. Defaults to `USD`.
   * @param locale the locale. Defaults to `en-US`. Examples: `en-US`, `en-GB`, `fr-FR`.
   */
  public getCurrencyFormat(
    isoCurrencyCode: string = DEFAULT_CURRENCY_CODE,
    locale: string = DEFAULT_LOCALE
  ): SkyCurrencyFormat {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: isoCurrencyCode
    });

    const resolvedOptions: Intl.ResolvedNumberFormatOptions = formatter.resolvedOptions();
    const currencyCode = resolvedOptions.currency;
    const parts = this.formatToParts(formatter);

    return {
      locale: locale,
      isoCurrencyCode: currencyCode,
      symbol: parts.symbol,
      symbolLocation: parts.symbolLocation,
      decimalCharacter: parts.decimalCharacter,
      groupCharacter: parts.groupCharacter,
      precision: resolvedOptions.maximumFractionDigits
    };
  }

  private formatToParts(formatter: Intl.NumberFormat): CurrencyFormatParts {
    const BIG_VALUE_TO_GET_PART_INFO: number = 100_000_000;

    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(BIG_VALUE_TO_GET_PART_INFO);

      type IntlFindFn = (intlType: Intl.NumberFormatPartTypes, defaultValue: string) => string;
      const findOrDefault: IntlFindFn = (intlType, defaultValue) =>
        parts.find(p => p.type === intlType)?.value ?? defaultValue;

      return {
        symbol: findOrDefault('currency', ''),
        symbolLocation: parts.findIndex(p => p.type === 'currency') === 0 ? 'prefix' : 'suffix',
        decimalCharacter: findOrDefault('decimal', DEFAULT_DECIMAL_CHARACTER),
        groupCharacter: findOrDefault('group', DEFAULT_GROUP_CHARACTER)
      };
    }

    return this.shimFormatToParts(formatter);
  }

  /**
   * Shims INTL.NumberFormatter.formatToParts since it does not exist in IE.
   */
  private shimFormatToParts(formatter: Intl.NumberFormat): CurrencyFormatParts {
    const zeroCurrency: string = formatter.format(0);
    const firstZeroIndex: number = zeroCurrency.indexOf('0');
    const lastZeroIndex: number = zeroCurrency.lastIndexOf('0');

    const currencySymbol: string = (
      zeroCurrency.slice(0, firstZeroIndex) +
      zeroCurrency.slice(lastZeroIndex + 1)
    ).trim();
    const symbolLocation: SkyCurrencySymbolLocation =
      zeroCurrency.indexOf(currencySymbol) === 0 ? 'prefix' : 'suffix';

    return {
      symbol: currencySymbol,
      symbolLocation: symbolLocation,
      decimalCharacter: DEFAULT_DECIMAL_CHARACTER,
      groupCharacter: DEFAULT_GROUP_CHARACTER
    };
  }
}

type CurrencyFormatParts = {
  symbol: string;
  symbolLocation: SkyCurrencySymbolLocation;
  decimalCharacter: string;
  groupCharacter: string;
};
