// #region imports
import {
  ChangeDetectorRef,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyLibResourcesService
} from './lib-resources.service';
import {
  SkyAppLocaleInfo
} from './locale-info';
// #endregion

@Pipe({
  name: 'skyLibResources',
  pure: false
})
export class SkyLibResourcesPipe implements PipeTransform {
  private resourceCache: {[key: string]: any} = {};

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resourcesService: SkyLibResourcesService
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
      if (localeInfo === undefined) {
        this.resourcesService.getString(name, ...templateArgs).subscribe((value: string) => {
          this.resourceCache[cacheKey] = value;
        });
      } else {
        this.resourceCache[cacheKey] = this.resourcesService.getStringForLocale(localeInfo, name, ...templateArgs);
      }
      this.changeDetector.markForCheck();
    }

    return this.resourceCache[cacheKey];
  }
}
