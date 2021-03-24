import { TestBed } from '@angular/core/testing';
import { Options as AutonumericOptions } from 'autonumeric';
import { provideAutoSpy, Spy } from 'jasmine-auto-spies';

import { SkyCurrencyFormatService } from './currency-format.service';
import { SkyAppLocaleProvider } from '../locale-provider';

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

  describe('getSkyAutonumericConfig', () => {
    describe('locale source', () => {
      it('sources the locale if explicitly passed in', async () => {
        spyOn(service, 'getCurrencyFormat').and.callThrough();

        await service.getSkyAutonumericConfig({ locale: 'en-CA' }).toPromise();
        expect(service.getCurrencyFormat).toHaveBeenCalledWith({
          isoCode: undefined,
          locale: 'en-CA'
        });
      });
      it('sources the locale from SkyAppLocaleProvider otherwise', async () => {
        spyOn(service, 'getCurrencyFormat').and.callThrough();
        localeProvider.getLocaleInfo.and.nextWith({ locale: 'en-GB' });

        await service.getSkyAutonumericConfig().toPromise();
        expect(service.getCurrencyFormat).toHaveBeenCalledWith({
          isoCode: undefined,
          locale: 'en-GB'
        });
      });
    });
    describe('autonumeric overrides', () => {
      it('should allow user to override config', async () => {
        const result: AutonumericOptions = await service
          .getSkyAutonumericConfig({
            isoCode: 'USD',
            autonumericOverrides: {
              currencySymbol: '???',
              minimumValue: '0',
              negativeBracketsTypeOnBlur: '(,)'
            }
          })
          .toPromise();
        expect(result.currencySymbol).toBe('???');
        expect(result.minimumValue).toBe('0');
        expect(result.negativeBracketsTypeOnBlur).toBe('(,)');
      });
    });
  });

  describe('getCurrencyFormat', () => {
    describe('currency code source', () => {
      it('sources the isoCode if explicitly passed in', async () => {
        const result: AutonumericOptions = await service
          .getSkyAutonumericConfig({ isoCode: 'JPY' })
          .toPromise();
        expect(result.currencySymbol).toBe('¥');
      });
      it('defaults the isoCode to "USD" otherwise', async () => {
        const result: AutonumericOptions = await service.getSkyAutonumericConfig().toPromise();
        expect(result.currencySymbol).toBe('$');
      });
    });
    describe('browser locale code source', () => {
      it('sources the locale if explicitly passed in', () => {
        const result = service.getCurrencyFormat({ locale: 'en-CA' });
        expect(result.locale).toBe('en-CA');
      });
      it('sources the locale as "en-US" otherwise', () => {
        localeProvider.getLocaleInfo.and.nextWith({ locale: (undefined as unknown) as string });
        const result = service.getCurrencyFormat();
        expect(result.locale).toBe('en-US');
      });
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
        const result: AutonumericOptions = await service
          .getSkyAutonumericConfig({ isoCode: currency })
          .toPromise();
        expect(result).toBeDefined();
        expect(result.decimalPlaces).toBe(precision);
      });
    });
  });
});
