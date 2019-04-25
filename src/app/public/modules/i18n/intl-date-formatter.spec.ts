import {
  SkyIntlDateFormatter
} from './intl-date-formatter';

describe('Intl date formatter', function () {
  let testDate: Date;
  let testHours: string;
  let testAmPm: string;
  let testTimeZone: string;

  beforeEach(function () {
    testDate = new Date('4/24/2019');

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
    const dateFixtures: any = {
      'EEE, M/d/y': 'Wed, 4/24/2019',
      'EEE, M/d': 'Wed, 4/24',
      'MMM d': 'Apr 24',
      'dd/MM/yyyy': '24/04/2019',
      'MM/dd/yyyy': '04/24/2019',
      'yMEEEd': '20194Wed24',
      'MEEEd': '4Wed24',
      'MMMd': 'Apr24',
      'yMMMMEEEEd': 'Wednesday, April 24, 2019',
      'MMM kk ww ?? qq': 'Apr kk 4/24/2019 ?? qq',
      'yyyy HH a Z': '2019 00 AM EDT',
      'yyyy ss a Z': '2019 00 AM EDT'
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
