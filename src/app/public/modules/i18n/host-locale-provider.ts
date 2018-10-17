import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAppWindowRef
} from '@skyux/core/modules/window';

import {
  SkyAppLocaleInfo
} from './locale-info';

import {
  SkyAppLocaleProvider
} from './locale-provider';

@Injectable()
export class SkyAppHostLocaleProvider implements SkyAppLocaleProvider {

  public get defaultLocale(): string {
    return 'en-US';
  }

  constructor(
    private windowRef: SkyAppWindowRef
  ) { }

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    console.warn([
      'The class `SkyAppHostLocaleProvider`, imported from `@skyux/i18n`',
      'is deprecated. Please import from `@blackbaud/skyux-builder/runtime/i18n`.'
    ].join(' '));

    let locale: string;

    const skyuxHost = (this.windowRef.nativeWindow as any).SKYUX_HOST;

    if (skyuxHost) {
      const acceptLanguage = skyuxHost.acceptLanguage || '';
      locale = acceptLanguage.split(',')[0];
    }

    locale = locale || this.defaultLocale;

    return Observable.of({
      locale: locale
    });
  }
}
