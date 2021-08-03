import {
  NgModule
} from '@angular/core';
import { getStringForLocale } from './get-string-for-locale';

import {
  SkyLibResourcesPipe
} from './lib-resources.pipe';
import { SkyAppResources } from './resources';

import {
  SkyAppResourcesPipe
} from './resources.pipe';

function doSomething() {
  const resources: {[locale: string]: SkyAppResources} = {
    'EN-US': {
      'foobar': {
        message: 'Hello, world.'
      }
    }
  };

  const thing = getStringForLocale(resources, 'en-US', 'foobar');
}

@NgModule({
  declarations: [
    SkyAppResourcesPipe,
    SkyLibResourcesPipe
  ],
  exports: [
    SkyAppResourcesPipe,
    SkyLibResourcesPipe
  ]
})
export class SkyI18nModule { }
