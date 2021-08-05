import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { SkyuxVersions } from '../../shared/skyux-versions';
import { createTestApp, createTestLibrary } from '../../testing/scaffold';
import { readRequiredFile } from '../../utility/tree';

describe('lib-resources-module.schematic', () => {
  const collectionPath = path.resolve(__dirname, '../../collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'lib-resources-module';

  const resourcesModulePath = `/projects/${defaultProjectName}/src/${defaultProjectName}-resources.module.ts`;
  const defaultResourcesJsonPath = `/projects/${defaultProjectName}/src/assets/locales/resources_en_US.json`;
  const packageJsonPath = `projects/${defaultProjectName}/package.json`;

  const runner = new SchematicTestRunner('schematics', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });

    // Create a default resources file.
    tree.create(
      defaultResourcesJsonPath,
      JSON.stringify({
        foobar: {
          _description: 'A simple message.',
          message: 'Hello, world!',
        },
      })
    );
  });

  function runSchematic(
    options: { name?: string; project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync(schematicName, options, tree).toPromise();
  }

  it('should generate a resources module', async () => {
    tree.create(
      `/projects/${defaultProjectName}/src/assets/locales/resources_fr_CA.json`,
      '{}'
    );

    const updatedTree = await runSchematic();

    const moduleContents = readRequiredFile(updatedTree, resourcesModulePath);

    expect(moduleContents).toEqual(`/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module' schematic.
 * To update this file, simply rerun the command.
 */

import { NgModule } from '@angular/core';
import {
  getLibStringForLocale,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import en_us from 'projects/my-lib/src/assets/locales/resources_en_US.json';
import fr_ca from 'projects/my-lib/src/assets/locales/resources_fr_CA.json';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': en_us,
  'FR-CA': fr_ca,
};

class MyLibResourcesProvider implements SkyLibResourcesProvider {
  public getString(localeInfo: SkyAppLocaleInfo, name: string): string {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: MyLibResourcesProvider,
    multi: true
  }]
})
export class MyLibResourcesModule { }
`);
  });

  it('should create a default resources file if none exists', async () => {
    tree.delete(defaultResourcesJsonPath);

    const updatedTree = await runSchematic();

    expect(readRequiredFile(updatedTree, defaultResourcesJsonPath)).toEqual(
      `{
  "hello_world": {
    "_description": "A simple message.",
    "message": "Hello, world!"
  }
}
`
    );
  });

  it('should overwrite the local resources module if it exists', async () => {
    tree.create(resourcesModulePath, 'ORIGINAL CONTENT');

    const updatedTree = await runSchematic();

    expect(readRequiredFile(updatedTree, resourcesModulePath)).not.toContain(
      'ORIGINAL CONTENT'
    );
  });

  it('should handle invalid project name', async () => {
    await expectAsync(
      runSchematic({ project: 'invalid-project' })
    ).toBeRejectedWithError(
      'The "invalid-project" project is not defined in angular.json. Provide a valid project name.'
    );
  });

  it('should allow changing the location of the module', async () => {
    const updatedTree = await runSchematic({
      name: 'shared/foobar',
    });

    const customModulePath =
      '/projects/my-lib/src/shared/foobar-resources.module.ts';

    expect(updatedTree.exists(customModulePath)).toEqual(true);

    const moduleContents = readRequiredFile(updatedTree, customModulePath);

    expect(moduleContents).toEqual(`/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module shared/foobar' schematic.
 * To update this file, simply rerun the command.
 */

import { NgModule } from '@angular/core';
import {
  getLibStringForLocale,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import en_us from 'projects/my-lib/src/assets/locales/resources_en_US.json';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': en_us,
};

class FoobarResourcesProvider implements SkyLibResourcesProvider {
  public getString(localeInfo: SkyAppLocaleInfo, name: string): string {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: FoobarResourcesProvider,
    multi: true
  }]
})
export class FoobarResourcesModule { }
`);
  });

  it('should add `@skyux/i18n` as a peer dependency', async () => {
    // Overwrite package.json.
    tree.overwrite(packageJsonPath, '{}');

    const updatedTree = await runSchematic();

    const packageJsonContents = JSON.parse(
      readRequiredFile(updatedTree, packageJsonPath)
    );

    expect(packageJsonContents.peerDependencies['@skyux/i18n']).toEqual(
      SkyuxVersions.I18n
    );
  });

  it('should abort for application projects', async () => {
    const app = await createTestApp(runner, {
      defaultProjectName: 'foo-app',
    });

    await runner
      .runSchematicAsync(
        schematicName,
        {
          project: 'foo-app',
        },
        app
      )
      .toPromise();

    expect(app.exists(resourcesModulePath)).toBeFalse();
  });

  it('should throw an error if package.json does not exist', async () => {
    tree.delete(packageJsonPath);

    await expectAsync(runSchematic()).toBeRejectedWithError(
      `The file '${packageJsonPath}' was expected to exist but was not found.`
    );
  });
});
