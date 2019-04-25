import {
  SkyIntlDateFormatter
} from './intl-date-formatter';

describe('Intl date formatter', function () {
  let testDate: Date;
  let testHours: string;
  let testAmPm: string;
  let testTimeZone: string;

  beforeEach(function () {
    testDate = new Date(2019, 3, 24, 5, 23, 15, 1020);

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

  it('should format common multi component patterns', function () {
    const date = new Date(2015, 5, 15);

    const dateFixtures: any = {
      'EEE, M/d/y': 'Mon, 6/15/2015',
      'EEE, M/d': 'Mon, 6/15',
      'MMM d': 'Jun 15',
      'dd/MM/yyyy': '15/06/2015',
      'MM/dd/yyyy': '06/15/2015',
      'yMEEEd': '20156Mon15',
      'MEEEd': '6Mon15',
      'MMMd': 'Jun15',
      'yMMMMEEEEd': 'Monday, June 15, 2015',
      'MMM kk ww ?? qq': 'Jun kk 6/15/2015 ?? qq',
      'yyyy HH a Z': '2015 00 AM EDT',
      'yyyy ss a Z': '2015 00 AM EDT'
    };

    Object.keys(dateFixtures).forEach((pattern: string) => {
      const formattedDate = SkyIntlDateFormatter.format(date, 'en-US', pattern);
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

    expect(formattedDate).toBe(`2019 ${testHours} ${testAmPm} ${testTimeZone}`);
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
