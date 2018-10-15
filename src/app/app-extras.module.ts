import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from './public';

import {
  SkySampleResourcesModule
} from './demos';

@NgModule({
  exports: [
    SkyI18nModule,
    SkySampleResourcesModule
  ]
})
export class AppExtrasModule { }
