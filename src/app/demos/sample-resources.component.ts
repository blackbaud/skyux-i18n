import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyLibResourcesService
} from '../public';

@Component({
  selector: 'sky-sample-resources',
  template: `{{ 'greeting' | skyLibResources }}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySampleResourcesComponent implements OnInit {
  constructor(
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnInit(): void {
    const value = this.resourcesService.getDefaultString('greeting');
    console.log('Default value (static):', value);

    this.resourcesService.getString('greeting', 'harper')
      .subscribe((localizedValue: string) => {
        console.log('Localized value (async):', localizedValue);
      });
  }
}
