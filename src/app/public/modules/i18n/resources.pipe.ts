import {
  ChangeDetectorRef,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  SkyAppLocaleInfo
} from './locale-info';

import {
  SkyAppResourcesService
} from './resources.service';

/**
 * An Angular pipe for displaying a resource string.
 */
@Pipe({
  name: 'skyAppResources',
  pure: false
})
export class SkyAppResourcesPipe implements PipeTransform {
  private resourceCache: {[key: string]: any} = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resourcesSvc: SkyAppResourcesService
  ) { }

  // tslint:disable:max-line-length
  /**
   * Transforms a named resource string into its value.
   * @param args Either string (resource name) and any[] (template args) or SkyAppLocaleInfo, string (resource name) and any[] (template args).
   */
  // tslint:enable:max-line-length
  public transform(...args: any[]): string {
    let localeInfo: SkyAppLocaleInfo;
    let name: string;
    let templateArgs: any[];
    if (typeof args[0] === 'string') {
      name = args[0];
      templateArgs = args.slice(1);
    } else {
      localeInfo = args[0];
      name = args[1];
      templateArgs = args.slice(2);
    }
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.resourceCache)) {
      const obs: Observable<string> = localeInfo === undefined ?
        this.resourcesSvc.getString(name, ...templateArgs) :
        this.resourcesSvc.getStringForLocale(localeInfo, name, ...templateArgs);
      obs.subscribe((result) => {
        this.resourceCache[cacheKey] = result;
        this.changeDetector.markForCheck();
      });
    }

    return this.resourceCache[cacheKey];
  }
}
