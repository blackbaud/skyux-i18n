import {
  Inject,
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/merge';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from './lib-resources-providers-token';

import {
  SkyLibResourcesProvider
} from './lib-resources-provider';

@Injectable()
export class SkyLibResourcesService {
  private value$ = new BehaviorSubject<string>('');

  constructor(
    @Inject(SKY_LIB_RESOURCES_PROVIDERS) private resourcesProviders: SkyLibResourcesProvider[]
  ) { }

  public getString(name: string, ...args: any[]): Observable<string> {
    const observables = this.resourcesProviders.map((provider) => {
      return provider.getString(name, args);
    });

    Observable.merge(...observables)
      .subscribe((value: string) => {
        this.value$.next(value);
      });

    return this.value$;
  }

  public getDefaultString(name: string, ...args: any[]): string {
    let value: string;

    this.resourcesProviders.find((provider) => {
      value = provider.getDefaultString(name, args);
      return value !== undefined;
    });

    return value;
  }
}
