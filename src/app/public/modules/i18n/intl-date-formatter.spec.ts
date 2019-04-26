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
    testDate = new Date('2019-04-24T09:07:34Z');

    // Set time to a specific timezone.
    testDate.setTime(
      testDate.getTime() + testDate.getTimezoneOffset() * 60 * 1000
    );
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

  it('should format the date/time according to specified locale and custom format', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      testDate,
      'en-US',
      'yyyy HH a Z'
    );

    const hours = `0${testDate.getHours().toString()}`;

    const meridiem = testDate.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true
    }).substr(-2);

    const timezoneFragments = testDate.toLocaleString('en-US', {
      timeZoneName: 'short'
    }).split(' ');

    let timezone = timezoneFragments[timezoneFragments.length - 1];

    if (isIE) {
      // IE adds minutes to the hours.
      // IE does not include timezone in the formatted locale string.
      timezone = '00';
      expect(formattedDate).toBe(`2019 ${hours}:00 ${meridiem} ${timezone}`);
    } else {
      expect(formattedDate).toBe(`2019 ${hours} ${meridiem} ${timezone}`);
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
