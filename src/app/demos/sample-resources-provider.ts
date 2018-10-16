import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '../public';

export class SkySampleResourcesProvider implements SkyLibResourcesProvider {
  public getString: (localeInfo: SkyAppLocaleInfo, name: string) => string;
}
