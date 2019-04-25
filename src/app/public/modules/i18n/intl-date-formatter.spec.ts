import {
  SkyBrowserDetector
} from './browser-detector';

import {
  SkyIntlDateFormatter
} from './intl-date-formatter';

describe('Intl date formatter', function () {
  const isIE = SkyBrowserDetector.isIE;

  let testDate: Date;

  beforeEach(function () {
    testDate = new Date('Apr 24 2019 13:00:00 EST');
  });

  it('should format common multi component patterns', function () {
    const dateFixtures: any = {
      'EEE, M/d/y': 'Wed, 4/24/2019',
      'EEE, M/d': 'Wed, 4/24',
      'MMM d': 'Apr 24',
      'dd/MM/yyyy': '24/04/2019',
      'MM/dd/yyyy': '04/24/2019',
      'yMEEEd': '20194Wed24',
      'MEEEd': '4Wed24',
      'MMMd': 'Apr24',
      'yMMMMEEEEd': 'Wednesday, April 24, 2019'
    };

    Object.keys(dateFixtures).forEach((pattern: string) => {
      const formattedDate = SkyIntlDateFormatter.format(testDate, 'en-US', pattern);
      const expectation = dateFixtures[pattern];

      expect(formattedDate).toEqual(expectation);
    });
  });

  it('should format the date according to the specified locale and custom format', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      testDate,
      'en-US',
      'yyyy HH a Z'
    );

    if (isIE) {
      // IE adds minutes to the hours.
      expect(formattedDate).toBe('2019 14:00 PM 00');
    } else {
      expect(formattedDate).toBe('2019 14 PM EDT');
    }
  });

  it('should handle non-date part characters in the format string', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      testDate,
      'en-US',
      'yyyy~\'\'M'
    );

    expect(formattedDate).toBe('2019~\'4');
  });

  it('should handle invalid dates', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      new Date('invalid'),
      undefined,
      undefined
    );

    expect(formattedDate).toEqual('');
  });
});
