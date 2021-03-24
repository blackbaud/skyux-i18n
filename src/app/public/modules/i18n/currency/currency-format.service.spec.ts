import { TestBed } from '@angular/core/testing';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';

import { SkyCurrencyFormatService } from './currency-format.service';
import { SkyAppLocaleProvider } from '../locale-provider';
import { SkyCurrencyFormat } from './currency-format';

describe('SkyCurrencyFormatService', () => {
  let service: SkyCurrencyFormatService;
  let localeProvider: Spy<SkyAppLocaleProvider>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SkyCurrencyFormatService,
        provideAutoSpy(SkyAppLocaleProvider)
      ]
    });

    service = TestBed.inject(SkyCurrencyFormatService);
    localeProvider = TestBed.inject<any>(SkyAppLocaleProvider);

    localeProvider.getLocaleInfo.and.nextWith({ locale: 'en-US' });
  });

  describe('getCurrencyFormat', () => {
    describe('currency code source', () => {
      it('sources the isoCode if explicitly passed in', async () => {
        const result: SkyCurrencyFormat = service.getCurrencyFormat({ isoCode: 'JPY' });
        expect(result.symbol).toBe('¥');
      });
      it('defaults the isoCode to "USD" otherwise', async () => {
        const result: SkyCurrencyFormat = service.getCurrencyFormat();
        expect(result.symbol).toBe('$');
      });
    });
    describe('browser locale code source', () => {
      it('sources the locale if explicitly passed in', () => {
        const result = service.getCurrencyFormat({ locale: 'en-CA' });
        expect(result.locale).toBe('en-CA');
      });
      it('defaults the locale to "en-US" otherwise', () => {
        localeProvider.getLocaleInfo.and.nextWith({ locale: (undefined as unknown) as string });
        const result = service.getCurrencyFormat();
        expect(result.locale).toBe('en-US');
      });
    });
  });

  describe('getCurrencyFormatAsync', () => {
    describe('currency code source', () => {

    });
    describe('browser locale code source', () => {

    });
  });

  describe('currency support', () => {
    const currencyAndPrecision: [string, number][] = [
      ['JPY', 0],
      ['USD', 2],
      ['AUD', 2],
      ['CAD', 2],
      ['EUR', 2]
    ];
    currencyAndPrecision.forEach(([currency, precision]) => {
      it(`should get formatting options for ${currency}`, async () => {
        const result: SkyCurrencyFormat = service.getCurrencyFormat({ isoCode: currency });
        expect(result).toBeDefined();
        expect(result.precision).toBe(precision);
      });
    });
  });
});
