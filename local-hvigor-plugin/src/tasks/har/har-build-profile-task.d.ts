import { TargetTaskService } from '../service/target-task-service.js';
import { OhosHarTask } from "../task/ohos-har-task.js";
export interface HarBuildProfileData {
    HAR_VERSION: string;
    BUILD_MODE_NAME: string;
    DEBUG: boolean;
    TARGET_NAME: string;
}
export declare class HarBuildProfileTask extends OhosHarTask {
    private _log;
    protected readonly harTaskService: TargetTaskService;
    protected harBuildProfileData: HarBuildProfileData | undefined;
    constructor(taskService: TargetTaskService);
    protected initDefaultData(): void;
    private get appJsonPath();
    private get projectProfilePath();
    private get harBuildProfilePath();
    private get buildModeName();
    private get buildMode();
    private get buildProfileFields();
    private get harVersion();
    private get harTargetName();
    initTaskDepends(): void;
    protected doTaskAction(): void;
}
