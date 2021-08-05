import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import { SkyuxVersions } from '../shared/skyux-versions';

export default function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/assets',
      version: SkyuxVersions.Assets,
      overwrite: true,
    });

    return tree;
  };
}
