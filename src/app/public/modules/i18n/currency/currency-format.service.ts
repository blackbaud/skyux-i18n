import { getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SkyCurrencyFormat } from './currency-format';
import { SkyAppLocaleProvider } from '../locale-provider';

type IsoCodeAndLocale = { isoCode: string; locale: string };
type CurrencyFormatParts = {
  symbol: string;
  symbolLocation: 'p' | 's';
  decimalCharacter: string;
  groupCharacter: string;
};

/**
 * Service to get a currency's format given an iso code.
 */
@Injectable({
  providedIn: 'root'
})
export class SkyCurrencyFormatService {
  constructor(private localeProvider: SkyAppLocaleProvider) { }

  /**
   * Gets the currency formatting.
   * @param params optional params object
   * @param params.isoCode the ISO 4217 Code. Defaults to `USD`.
   * @param params.locale the locale.
   */
  public getCurrencyFormat(params?: Partial<IsoCodeAndLocale>): SkyCurrencyFormat {
    const isoCode = params?.isoCode ?? 'USD';
    const locale = params?.locale ?? 'en-US';
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: isoCode });

    const resolvedOptions: Intl.ResolvedNumberFormatOptions = formatter.resolvedOptions();
    const currencyCode = resolvedOptions.currency ?? isoCode;
    const parts = this.formatToParts(formatter, currencyCode, locale);

    return {
      locale: locale,
      isoCode: currencyCode,
      symbol: parts.symbol,
      symbolLocation: parts.symbolLocation,
      decimalCharacter: parts.decimalCharacter,
      groupCharacter: parts.groupCharacter,
      precision: resolvedOptions.maximumFractionDigits
    };
  }

  /**
   * Gets an observable of the currency formatting.
   * @param params optional params object
   * @param params.isoCode the ISO 4217 Code. Defaults to `USD`.
   * @param params.locale the locale. Defaults to `SkyAppLocaleProvider.getLocaleInfo`.
   */
  public getCurrencyFormatAsync(params?: Partial<IsoCodeAndLocale>): Observable<SkyCurrencyFormat> {
    return this.getLocaleInfo(params.locale).pipe(
      map(locale => ({ ...params, locale })),
      map(isoCodeAndLocale => this.getCurrencyFormat(isoCodeAndLocale))
    );
  }

  /**
   * Given an ISO Code return its precision.
   * @param isoCode the ISO 4217. Defaults to `USD`.
   */
  public getCurrencyPrecision(isoCode: string): number {
    return this.getCurrencyFormat({ isoCode }).precision;
  }

  private getLocaleInfo(locale: string | undefined): Observable<string> {
    if (locale !== undefined) {
      return of(locale);
    }

    return this.localeProvider.getLocaleInfo().pipe(
      take(1),
      map(skyLocaleInfo => skyLocaleInfo.locale)
    );
  }

  private formatToParts(
    formatter: Intl.NumberFormat,
    currencyCode: string,
    locale: string
  ): CurrencyFormatParts {
    const BIG_VALUE_TO_GET_PART_INFO: number = 100_000_000;

    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(BIG_VALUE_TO_GET_PART_INFO);

      return {
        symbol: parts.find(p => p.type === 'currency')?.value ?? '',
        symbolLocation: parts.findIndex(p => p.type === 'currency') === 0 ? 'p' : 's',
        decimalCharacter: parts.find(p => p.type === 'decimal')?.value ?? '.',
        groupCharacter: parts.find(p => p.type === 'group')?.value ?? ','
      };
    }

    return this.shimFormatToParts(currencyCode, locale);
  }

  /**
   * Shims INTL.NumberFormatter.formatToParts since it does not exist in IE.
   * @param currencyCode
   * @param locale
   */
  private shimFormatToParts(currencyCode: string, locale: string): CurrencyFormatParts {
    return {
      symbol: getCurrencySymbol(currencyCode, 'narrow', locale),
      symbolLocation: 'p',
      decimalCharacter: '.',
      groupCharacter: ','
    };
  }
}
