import {
  SkyCurrencyFormatService
} from './currency-format.service';

import {
  SkyCurrencyFormat
} from './currency-format';

import {
  SkyBrowserDetector
} from '../browser-detector';

describe('SkyCurrencyFormatService', () => {
  let service: SkyCurrencyFormatService;
  const isIE = SkyBrowserDetector.isIE;

  beforeEach(() => service = new SkyCurrencyFormatService());

  describe('getCurrencyFormat', () => {
    describe('currency code source', () => {
      it('sources the currency code from the parameters if explicitly passed in', async () => {
        const result: SkyCurrencyFormat = service.getCurrencyFormat({ isoCurrencyCode: 'JPY' });
        expect(result.symbol).toBe('¥');
      });
      it('defaults the currency code to "USD" otherwise', async () => {
        const result: SkyCurrencyFormat = service.getCurrencyFormat();
        expect(result.symbol).toBe('$');
      });
    });

    describe('locale source', () => {
      it('sources the locale from the parameters if explicitly passed in', () => {
        const result = service.getCurrencyFormat({ locale: 'en-CA' });
        expect(result.locale).toBe('en-CA');
      });
      it('defaults the locale to "en-US" otherwise', () => {
        const result = service.getCurrencyFormat();
        expect(result.locale).toBe('en-US');
      });
    });

    describe('currency rules', () => {
      it('should have the currency symbol as the prefix for "en-CA"', () => {
        const result = service.getCurrencyFormat({ locale: 'en-CA' });
        expect(result.symbolLocation).toBe('prefix');
      });
      it('should have the currency symbol as the suffix for "fr-CA"', () => {
        const result = service.getCurrencyFormat({ locale: 'fr-CA' });
        expect(result.symbolLocation).toBe('suffix');
      });
    });

    describe('Browser compatability', () => {
      it('should shim the INTL.formatToParts browser api if needed', () => {
        const result = service.getCurrencyFormat({ locale: 'en-CA', isoCurrencyCode: 'USD' });

        expect(result.locale).toBe('en-CA');
        expect(result.isoCurrencyCode).toBe('USD');
        expect(result.symbolLocation).toBe('prefix');
        expect(result.decimalCharacter).toBe('.');
        expect(result.groupCharacter).toBe(',');
        expect(result.precision).toBe(2);

        if (isIE) {
          expect(result.symbol).toBe('$');
        } else {
          expect(result.symbol).toBe('US$');
        }
      });
    });
  });

  describe('getCurrencyPrecision', () => {
    const currencyAndPrecision: [string, number][] = [
      ['JPY', 0],
      ['USD', 2],
      ['AUD', 2],
      ['CAD', 2],
      ['EUR', 2]
    ];
    currencyAndPrecision.forEach(([currency, precision]) => {
      it(`should get the expected currency (${precision}) precision for ${currency}`, async () => {
        const result: number = service.getCurrencyPrecision(currency);
        expect(result).toBe(precision);
      });
    });
  });
});
