import {
  SkyAppLocaleProvider
} from './locale-provider';

describe('Locale provider', () => {
  it('should get locale info', () => {
    const provider = new SkyAppLocaleProvider();
    provider.getLocaleInfo().subscribe((localeInfo) => {
      expect(localeInfo.locale).toEqual('en-US');
    });
  });

  it('should get current locale string', () => {
    const provider = new SkyAppLocaleProvider();
    expect(provider.currentLocale).toEqual('en-US');
  });
});
