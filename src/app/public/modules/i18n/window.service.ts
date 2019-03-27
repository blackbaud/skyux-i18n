import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyI18nWindowService {
  public get nativeWindow(): Window {
    return window;
  }
}
