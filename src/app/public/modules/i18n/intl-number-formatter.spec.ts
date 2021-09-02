import {
  SkyBrowserDetector
} from './browser-detector';

import {
  SkyIntlNumberFormatStyle
} from './intl-number-format-style';

import {
  SkyIntlNumberFormatter
} from './intl-number-formatter';

function verifyResult(result: string, expectation: string): void {
  // Intl API uses non-breaking spaces in the result.
  expect(result.replace(/\s/g, ' ')).toEqual(expectation);
}

describe('Intl number formatter', function () {
  const isIE = SkyBrowserDetector.isIE;
  const isWindows7 = SkyBrowserDetector.isWindows7;

  it('should format currency for a locale', function () {
    const result = SkyIntlNumberFormatter.format(
      123456.789,
      'de-DE',
      SkyIntlNumberFormatStyle.Currency,
      {
        currency: 'EUR'
      }
    );

    verifyResult(result, '123.456,79 EUR');
  });

  it('should format currency with a symbol', function () {
    const result = SkyIntlNumberFormatter.format(
      123456.789,
      'de-DE',
      SkyIntlNumberFormatStyle.Currency,
      {
        currency: 'EUR',
        currencyAsSymbol: true
      }
    );

    verifyResult(result, '123.456,79 €');
  });

  it('should handle errors from Intl API', function () {
    try {
      SkyIntlNumberFormatter.format(
        123456.789,
        'en-US',
        SkyIntlNumberFormatStyle.Currency
      );
      fail('It should fail!');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should format decimal for a locale', function () {
    const result = SkyIntlNumberFormatter.format(
      123456.789,
      'de-DE',
      SkyIntlNumberFormatStyle.Decimal
    );

    verifyResult(result, '123.456,789');
  });

  it('should format percent for a locale', function () {
    const result = SkyIntlNumberFormatter.format(
      0.4789,
      'de-DE',
      SkyIntlNumberFormatStyle.Percent
    );

    // IE 11 doesn't add a space before the symbol.
    if (isIE && isWindows7) {
      verifyResult(result, '48%');
    } else {
      verifyResult(result, '48 %');
    }
  });

  it('should format positive accounting values', function() {
    const result = SkyIntlNumberFormatter.format(
      100.12,
      'en-US',
      SkyIntlNumberFormatStyle.Currency,
      {
        currency: 'USD',
        currencyAsSymbol: true,
        currencySign: 'accounting'
      }
    );

    verifyResult(result, '$100.12');
  });

  it('should format negative accounting values', function() {
    const result = SkyIntlNumberFormatter.format(
      -100.12,
      'en-US',
      SkyIntlNumberFormatStyle.Currency,
      {
        currency: 'USD',
        currencyAsSymbol: true,
        currencySign: 'accounting'
      }
    );

    // IE 11 doesn't support currencySign
    if (isIE && isWindows7) {
      verifyResult(result, '-$100.12');
    } else {
      verifyResult(result, '($100.12)');
    }
  });
});
