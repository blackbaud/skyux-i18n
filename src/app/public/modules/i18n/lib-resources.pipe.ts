import {
  ChangeDetectorRef,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyLibResourcesService
} from './lib-resources.service';

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

  public transform(name: string, ...args: any[]): Observable<string> {
    const cacheKey = name + JSON.stringify(args);

    if (!(cacheKey in this.resourceCache)) {
      this.resourcesService.getString(name, args)
        .subscribe((value: string) => {
          this.resourceCache[cacheKey] = value;
          this.changeDetector.markForCheck();
        });
    }

    return this.resourceCache[cacheKey];
  }
}
