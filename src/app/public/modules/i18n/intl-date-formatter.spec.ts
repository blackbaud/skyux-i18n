import {
  SkyIntlDateFormatter
} from './intl-date-formatter';

describe('date formatter', function () {
  let testDate: Date;
  let testHours: string;
  let testAmPm: string;
  let testTimeZone: string;

  beforeEach(function () {
    testDate = new Date('2019-04-24T13:43:59+00:00');

    testHours = testDate.getHours().toString();
    testHours = ('0' + testHours).substr(-2);

    testTimeZone = new Intl.DateTimeFormat(
      'en-US',
      {
        timeZoneName: 'short'
      }
    ).format(testDate).substr(-3);

    testAmPm = new Intl.DateTimeFormat(
      'en-US',
      {
        hour: 'numeric',
        hour12: true
      }
    ).format(testDate).substr(-2);
  });

  it('should format the date according to the specified locale and pattern alias', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      new Date('2019-04-24T13:43:59+00:00'),
      'en-US',
      'yMMMd'
    );

    expect(formattedDate).toBe('Apr 24, 2019');
  });

  it('should format the date according to the specified locale and custom format', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      new Date('2019-04-24T13:43:59+00:00'),
      'en-US',
      'yyyy HH a Z'
    );

    expect(formattedDate).toBe(`2019 ${testHours} ${testAmPm} ${testTimeZone}`);
  });

  it('should handle non-date part characters in the format string', function () {
    const formattedDate = SkyIntlDateFormatter.format(
      new Date('2019-04-24T13:43:59+00:00'),
      'en-US',
      'yyyy~\'\'M'
    );

    expect(formattedDate).toBe('2019~\'4');
  });
});
