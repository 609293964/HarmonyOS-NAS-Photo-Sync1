import { ProjectModel } from '../model/project/project-model.js';
import { ModuleBuildProfile } from '../options/build/module-build-profile.js';
export declare class TargetUtils {
    static pushTryTargets(params: {
        projectModel: ProjectModel;
        moduleName: string;
        superTargetName: string;
    }): string[];
    static computeTargets(specificTargets: any, optionTargets: ModuleBuildProfile.ModuleTargetBuildOpt[]): string[];
    static getFallbackTargets(): string[];
}
