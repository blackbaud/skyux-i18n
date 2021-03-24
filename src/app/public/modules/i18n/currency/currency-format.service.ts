import { getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Options as AutonumericOptions } from 'autonumeric';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SkyCurrencyFormat } from './currency-format';
import { SkyAppLocaleProvider } from '../locale-provider';

type IsoCodeAndLocale = { isoCode: string; locale: string };
type GetAutonumericConfigParams = {
  autonumericOverrides?: AutonumericOptions;
} & Partial<IsoCodeAndLocale>;
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
   * Creates an Autonumeric Config from a Locale and Currency Code.
   * http://autonumeric.org/guide
   * @param params optional params object
   * @param params.isoCode the ISO 4217 Code. Defaults to `USD`.
   * @param params.locale the Locale. Defaults to Sky's LocaleProvider or `en-US`.
   * @param params.autonumericOverrides overrides to the generated autonumeric options.
   */
  public getAutonumericConfig(params?: GetAutonumericConfigParams): Observable<AutonumericOptions> {
    return this.getLocaleInfo(params?.locale).pipe(
      map(locale => this.getCurrencyFormat({ isoCode: params?.isoCode, locale })),
      map(currencyFormat => currencyFormat.mapToSkyAutonumeric()),
      map(options => {
        if (params?.autonumericOverrides) {
          return { ...options, ...params.autonumericOverrides };
        }

        return options;
      })
    );
  }

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

    return new SkyCurrencyFormat({
      locale: locale,
      isoCode: currencyCode,
      symbol: parts.symbol,
      symbolLocation: parts.symbolLocation,
      decimalCharacter: parts.decimalCharacter,
      groupCharacter: parts.groupCharacter,
      precision: resolvedOptions.maximumFractionDigits
    });
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
