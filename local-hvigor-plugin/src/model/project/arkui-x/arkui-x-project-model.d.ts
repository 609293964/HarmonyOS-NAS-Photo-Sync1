import { ArkUIXConfigJson } from '../../../options/configure/arkui-x-config-opt.js';
import { ProjectBuildProfile } from '../../../options/build/project-build-profile.js';
import { CrossplatformInterface } from './crossplatform-interface.js';
export declare class ArkUIXProjectModel implements CrossplatformInterface {
    private readonly projectName;
    private readonly projectPath;
    private readonly profileOptions;
    private readonly _log;
    protected _arkUIXConfigJsonObj: ArkUIXConfigJson.ConfigObj | undefined;
    constructor(projectName: string, projectPath: string, profileOptions: ProjectBuildProfile.ProjectProfileOpt);
    isCrossplatformProject(): boolean;
    getArkUIXConfigJsonPath(): string;
    getArkUIXConfigJsonObj(): ArkUIXConfigJson.ConfigObj | undefined;
    private initArkUIXConfigJsonObj;
    private arkUIXModuleCheck;
}
