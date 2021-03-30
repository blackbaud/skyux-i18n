import {
  Injectable
} from '@angular/core';

import {
  getCurrencySymbol
} from '@angular/common';

import {
  SkyCurrencyFormat
} from './currency-format';

/**
 * Service to get a currency's format given an iso code.
 */
 @Injectable({
  providedIn: 'root'
})
export class SkyCurrencyFormatService {

  /**
   * Gets a currency's format.
   * @param params optional params object
   * @param params.isoCurrencyCode the ISO 4217 Currency Code. Defaults to `USD`.
   * @param params.locale the locale. Defaults to `en-US`. Examples: `en-US`, `en-GB`, `fr-FR`.
   */
  public getCurrencyFormat(params?: Partial<IsoCurrencyCodeAndLocale>): SkyCurrencyFormat {
    const isoCurrencyCode = params?.isoCurrencyCode ?? 'USD';
    const locale = params?.locale ?? 'en-US';
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: isoCurrencyCode
    });

    const resolvedOptions: Intl.ResolvedNumberFormatOptions = formatter.resolvedOptions();
    const currencyCode = resolvedOptions.currency;
    const parts = this.formatToParts(formatter, currencyCode, locale);

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

  /**
   * Given an ISO 4217 Currency Code return the currency's precision.
   * @param isoCurrencyCode the ISO 4217. Defaults to `USD`.
   */
  public getCurrencyPrecision(isoCurrencyCode: string): number {
    return this.getCurrencyFormat({ isoCurrencyCode: isoCurrencyCode }).precision;
  }

  private formatToParts(
    formatter: Intl.NumberFormat,
    isoCurrencyCode: string,
    locale: string
  ): CurrencyFormatParts {
    const BIG_VALUE_TO_GET_PART_INFO: number = 100_000_000;

    /* istanbul ignore else: Unsure how to mock a browser API missing */
    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(BIG_VALUE_TO_GET_PART_INFO);

      type IntlFindFn = (intlType: Intl.NumberFormatPartTypes, defaultValue: string) => string;
      const findOrDefault: IntlFindFn = (intlType, defaultValue) =>
        parts.find(p => p.type === intlType)?.value ?? defaultValue;

      return {
        symbol: findOrDefault('currency', ''),
        symbolLocation: parts.findIndex(p => p.type === 'currency') === 0 ? 'p' : 's',
        decimalCharacter: findOrDefault('decimal', '.'),
        groupCharacter: findOrDefault('group', ',')
      };
    }

    /* istanbul ignore next: Unsure how to mock a browser API missing */
    return this.shimFormatToParts(isoCurrencyCode, locale);
  }

  /**
   * Shims INTL.NumberFormatter.formatToParts since it does not exist in IE.
   * @param isoCurrencyCode
   * @param locale
   */
  /* istanbul ignore next: Unsure how to mock a browser API missing */
  private shimFormatToParts(isoCurrencyCode: string, locale: string): CurrencyFormatParts {
    return {
      symbol: getCurrencySymbol(isoCurrencyCode, 'narrow', locale),
      symbolLocation: 'p',
      decimalCharacter: '.',
      groupCharacter: ','
    };
  }
}

type IsoCurrencyCodeAndLocale = {
  isoCurrencyCode: string;
  locale: string
};

type CurrencyFormatParts = {
  symbol: string;
  symbolLocation: 'p' | 's';
  decimalCharacter: string;
  groupCharacter: string;
};
