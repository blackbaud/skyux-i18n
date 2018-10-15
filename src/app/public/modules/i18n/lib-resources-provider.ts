import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

@Injectable()
export abstract class SkyLibResourcesProvider {
  public getDefaultString: (name: string, ...args: any[]) => string;

  public getString: (name: string, ...args: any[]) => Observable<string>;
}
