import { SkyCurrencyService } from './currency.service';
import { take } from 'rxjs/operators';

describe('SkyCurrencyService', () => {
  let service: SkyCurrencyService;

  beforeEach(() => {
    service = new SkyCurrencyService();
  });

  describe('initial state', () => {
    it('should set the initial currency to USD', () => {
      expect(service.getCurrency()).toBe('USD');
    });
    it('should set the initial currencies to [USD]', () => {
      expect(service.getCurrencies()).toEqual(['USD']);
    });
  });

  describe('currency$', () => {
    it('should expose a currency stream', done => {
      service.setCurrencies(['USD', 'JPY']);
      service.setCurrency('USD');

      service.currency$.pipe(take(1)).subscribe(currency => {
        expect(currency).toBe('USD');
        done();
      });
    });
  });

  describe('currencies$', () => {
    it('should expose a currencies stream', done => {
      service.setCurrencies(['USD', 'JPY']);

      service.currencies$.pipe(take(1)).subscribe(currency => {
        expect(currency).toEqual(['USD', 'JPY']);
        done();
      });
    });
  });

  describe('setCurrencies', () => {
    it('should allow consumers to set a new list of currencies', () => {
      service.setCurrencies(['USD', 'JPY']);
      const currencies = service.getCurrencies();
      expect(currencies).toEqual(['USD', 'JPY']);
    });
  });
  describe('setCurrency', () => {
    it('should allow consumers to set a currency to one in the list', () => {
      service.setCurrencies(['USD', 'JPY']);
      service.setCurrency('JPY');
      expect(service.getCurrency()).toBe('JPY');
    });
    it('should throw an exception when a user tries to currency not in the currencies list', () => {
      service.setCurrencies(['USD', 'JPY']);
      expect(() => service.setCurrency('CAD')).toThrow();
    });
  });
});
