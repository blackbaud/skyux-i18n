import {
  SkyLibResources
} from './lib-resources';

/**
 * @internal
 */
 export function getLibStringForLocale(
  resources: {
    [locale: string]: SkyLibResources
  },
  preferredLocale: string,
  name: string
): string {
  const defaultLocale = 'en-US';

  function getResourcesForLocale(locale: string): SkyLibResources {
    const parsedLocale = locale.toUpperCase().replace('_', '-');
    return resources[parsedLocale];
  }

  let values: SkyLibResources = getResourcesForLocale(preferredLocale);

  if (values && values[name]) {
    return values[name].message;
  }

  // Attempt to locate default resources.
  values = getResourcesForLocale(defaultLocale);

  if (values && values[name]) {
    return values[name].message;
  }

  return name;
}
