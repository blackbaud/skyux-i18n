import {
  Observable
} from 'rxjs/Observable';

import {
  SkyLibResourcesProvider
} from '../public';

export class SkySampleResourcesProvider implements SkyLibResourcesProvider {
  public getDefaultString: (name: string, ...args: any[]) => string;

  public getString: (name: string, ...args: any[]) => Observable<string>;
}
