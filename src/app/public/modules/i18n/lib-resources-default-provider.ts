import {
  SkyLibResourcesProvider
} from './lib-resources-provider';

export class LibResourcesDefaultProvider implements SkyLibResourcesProvider {
  public getString(): string {
    return '';
  }
}
