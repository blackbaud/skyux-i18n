import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of as observableOf
} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class SkyAppResourceNameProvider {

  public getResourceName(name: string): Observable<string> {
    return observableOf(name);
  }
}
