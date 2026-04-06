import { TargetTaskService } from '../service/target-task-service.js';
import { OhosModuleTask } from '../task/ohos-module-task.js';
import { FileSet } from '@ohos/hvigor';
export declare class ProcessModulePrivacyProfile extends OhosModuleTask {
    private _log;
    private readonly originalModulePacJsonPath;
    private readonly processedPacJsonPath;
    constructor(taskService: TargetTaskService);
    taskShouldDo(): boolean;
    protected doTaskAction(): void;
    declareInputFiles(): FileSet;
    declareOutputFiles(): FileSet;
    initTaskDepends(): void;
}
