import {
  SkyAppLocaleProvider
} from './locale-provider';

describe('Locale provider', () => {
  beforeEach(() => {
    (window as any).navigator['__defineGetter__']('language', function () {
      return 'foo-BAR';
    });
  });

  it('should get locale from browser language', () => {
    const provider = new SkyAppLocaleProvider();
    provider.getLocaleInfo().subscribe((localeInfo) => {
      expect(localeInfo.locale).toEqual('foo_BAR');
    });
  });

  it('should get locale from userLanguage if language not supported', () => {
    (window as any).navigator['__defineGetter__']('language', function (): void {
      return undefined;
    });

    (window as any).navigator['__defineGetter__']('userLanguage', function (): string {
      return 'bar-BAZ';
    });

    const provider = new SkyAppLocaleProvider();
    provider.getLocaleInfo().subscribe((localeInfo) => {
      expect(localeInfo.locale).toEqual('bar_BAZ');
    });
  });
});
