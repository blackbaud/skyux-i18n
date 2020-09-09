import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of as observableOf
} from 'rxjs';

import {
  SkyAppLocaleInfo
} from './locale-info';

@Injectable()
export class SkyAppLocaleProvider {

  public get currentLocale(): string {
    return undefined;
  }

  public get defaultLocale(): string {
    return SkyAppLocaleProvider._defaultLocale;
  }

  private static _defaultLocale = 'en-US';

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return observableOf({
      locale: this.defaultLocale
    });
  }
}
