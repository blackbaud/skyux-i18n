import {
  forwardRef,
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  forkJoin,
  Observable,
  of as observableOf
} from 'rxjs';

import {
  catchError,
  map,
  publishReplay,
  refCount,
  switchMap
} from 'rxjs/operators';

import {
  Format
} from '../../utils/format';

import {
  SkyAppLocaleProvider
} from './locale-provider';

import {
  SkyAppResourceNameProvider
} from './resource-name-provider';

declare type SkyResourceType = {[key: string]: {message: string}};

const defaultResources: SkyResourceType = {};

function getDefaultObs(): Observable<SkyResourceType> {
  return observableOf(defaultResources);
}

/**
 * An Angular service for interacting with resource strings.
 */
@Injectable()
export class SkyAppResourcesService {
  private resourcesObs: Observable<SkyResourceType>;
  private httpObs: {[key: string]: Observable<SkyResourceType>} = {};

  constructor(
    private http: HttpClient,
    /* tslint:disable-next-line no-forward-ref */
    @Inject(forwardRef(() => SkyAppAssetsService)) private assets: SkyAppAssetsService,
    @Optional() private localeProvider: SkyAppLocaleProvider,
    @Optional() private resourceNameProvider: SkyAppResourceNameProvider
  ) { }

  /**
   * Gets a resource string based on its name.
   * @param name The name of the resource string.
   */
  public getString(name: string, ...args: any[]): Observable<string> {
    if (!this.resourcesObs) {
      const localeObs = this.localeProvider.getLocaleInfo();

      this.resourcesObs = localeObs.pipe(
        switchMap((localeInfo) => {
          let obs: Observable<any>;
          let resourcesUrl: string;

          const locale = localeInfo.locale;

          if (locale) {
            resourcesUrl =
              this.getUrlForLocale(locale) ||
              // Try falling back to the non-region-specific language.
              this.getUrlForLocale(locale.substr(0, 2));
          }

          // Finally fall back to the default locale.
          resourcesUrl = resourcesUrl || this.getUrlForLocale(
            this.localeProvider.defaultLocale
          );

          if (resourcesUrl) {
            obs = this.httpObs[resourcesUrl] || this.http.get<SkyResourceType>(resourcesUrl)
              .pipe(
                // publishReplay(1).refCount() will ensure future subscribers to
                // this observable will use a cached result.
                // https://stackoverflow.com/documentation/rxjs/8247/common-recipes/26490/caching-http-responses#t=201612161544428695958
                publishReplay(1),
                refCount(),
                catchError(() => {
                  // The resource file for the specified locale failed to load;
                  // fall back to the default locale if it differs from the specified
                  // locale.
                  const defaultResourcesUrl = this.getUrlForLocale(
                    this.localeProvider.defaultLocale
                  );

                  if (defaultResourcesUrl && defaultResourcesUrl !== resourcesUrl) {
                    return this.http.get<SkyResourceType>(defaultResourcesUrl);
                  }

                  return getDefaultObs();
                })
              );
          } else {
            obs = getDefaultObs();
          }

          this.httpObs[resourcesUrl] = obs;

          return obs;
        }),
        // Don't keep trying after a failed attempt to load resources, or else
        // impure pipes like resources pipe that call this service will keep
        // firing requests indefinitely every few milliseconds.
        catchError(() => getDefaultObs())
      );
    }

    let mappedNameObs = this.resourceNameProvider ?
    this.resourceNameProvider.getResourceName(name) : observableOf(name);

    return forkJoin([mappedNameObs, this.resourcesObs]).pipe(map(([mappedName, resources]): string => {
      let resource:  {message: string };

      if (mappedName in resources) {
        resource = resources[mappedName];
      } else if (name in resources) {
        resource = resources[name];
      }

      if (resource) {
        return Format.formatText(resource.message, ...args);
      }

      return name;
    }));
  }

  private getUrlForLocale(locale: string): string {
    return this.assets.getUrl(`locales/resources_${locale.replace('-', '_')}.json`);
  }
}
