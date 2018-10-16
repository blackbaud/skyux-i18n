import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAppLocaleInfo
} from './locale-info';

@Injectable()
export class SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    const locale = navigator.language || (navigator as any).userLanguage;
    return Observable.of({
      locale: locale.replace('-', '_')
    });
  }
}
