import { normalize, strings } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  apply,
  applyTemplates,
  chain,
  forEach,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import { getProject, getWorkspace } from '../../utility/workspace';

import { ResourceMessages } from './resource-messages';
import { Schema } from './schema';
import { TemplateContext } from './template-context';

function getResourceFilesContents(tree: Tree, project: ProjectDefinition) {
  const contents: any = {};
  const dirEntry = tree.getDir(normalize(`${project.root}/assets/locales`));

  dirEntry.subfiles
    .map((subfile) => normalize(`${project.root}/assets/locales/${subfile}`))
    .forEach((file) => {
      const locale = parseLocaleIdFromFileName(file);
      contents[locale] = JSON.parse(readRequiredFile(tree, file));
    });

  return contents;
}

/**
 * Standardize keys to be uppercase, due to some language limitations
 * with lowercase characters.
 * See: https://stackoverflow.com/questions/234591/upper-vs-lower-case
 */
function parseLocaleIdFromFileName(fileName: string): string {
  return fileName
    .split('.json')[0]
    .split('resources_')[1]
    .toLocaleUpperCase()
    .replace('_', '-');
}

function getResources(
  tree: Tree,
  project: ProjectDefinition
): ResourceMessages {
  const messages: ResourceMessages = {};
  const contents = getResourceFilesContents(tree, project);

  Object.keys(contents).forEach((locale) => {
    messages[locale] = {};
    Object.keys(contents[locale]).forEach((key) => {
      messages[locale][key] = contents[locale][key].message;
    });
  });

  return messages;
}

/**
 * Adds `@skyux/i18n` to the project's package.json `peerDependencies`.
 */
function addI18nPeerDependency(project: ProjectDefinition): Rule {
  return (tree) => {
    const packageJsonPath = normalize(`${project.root}/package.json`);
    const packageJsonContent = readRequiredFile(tree, packageJsonPath);

    const packageJson = JSON.parse(packageJsonContent);
    packageJson.peerDependencies = packageJson.peerDependencies || {};
    packageJson.peerDependencies['@skyux/i18n'] = '^5.0.0-beta.0';

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, undefined, 2));
  };
}

function ensureDefaultResourcesFileExists(project: ProjectDefinition): Rule {
  return (tree) => {
    const defaultResourcePath = normalize(
      `${project.root}/assets/locales/resources_en_US.json`
    );

    if (tree.exists(defaultResourcePath)) {
      return;
    }

    tree.create(
      defaultResourcePath,
      JSON.stringify(
        {
          hello_world: {
            _description: 'A simple message.',
            message: 'Hello, world!',
          },
        },
        undefined,
        2
      ) + '\n'
    );

    return tree;
  };
}

function generateTemplateFiles(
  project: ProjectDefinition,
  projectName: string
): Rule {
  return (tree) => {
    const movePath = normalize(project.sourceRoot + '/');
    const messages = getResources(tree, project);

    const templateContext: TemplateContext = {
      name: projectName,
      resources: JSON.stringify(messages),
    };

    const templateConfig = { ...strings, ...templateContext };

    const templateSource = apply(url('./files'), [
      applyTemplates(templateConfig),
      move(movePath),
      overwriteIfExists(tree),
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

/**
 * Fixes an Angular CLI issue with merge strategies.
 * @see https://github.com/angular/angular-cli/issues/11337#issuecomment-516543220
 */
function overwriteIfExists(tree: Tree): Rule {
  return forEach((fileEntry) => {
    if (tree.exists(fileEntry.path)) {
      tree.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}

export default function generateLibraryResourcesModule(options: Schema): Rule {
  return async (tree, context) => {
    const { workspace } = await getWorkspace(tree);

    const { project, projectName } = await getProject(
      workspace,
      options.project || (workspace.extensions.defaultProject as string)
    );

    // Abort if executed against an application.
    if (project.extensions.projectType === 'application') {
      context.logger.warn(
        `The project "${projectName}" is not of type "library". Aborting.`
      );
      return;
    }

    const rules: Rule[] = [
      addI18nPeerDependency(project),
      ensureDefaultResourcesFileExists(project),
      generateTemplateFiles(project, projectName),
    ];

    return chain(rules);
  };
}
