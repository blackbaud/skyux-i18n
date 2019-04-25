import {
  dateFormatter
} from './intl-date-formatter-utils';

export abstract class SkyIntlDateFormatter {
  public static format(
    date: Date,
    locale: string,
    pattern: string
  ): string {
    return dateFormatter(pattern, date, locale);
  }
}
