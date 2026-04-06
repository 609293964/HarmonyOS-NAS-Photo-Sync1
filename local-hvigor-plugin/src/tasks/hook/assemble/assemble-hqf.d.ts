import { ModuleTaskService } from '../../service/module-task-service.js';
import { TargetTaskService } from '../../service/target-task-service.js';
import { AbstractModuleHookTask } from '../abstract-module-hook-task.js';
export declare class AssembleHqf extends AbstractModuleHookTask {
    static isAdd: boolean;
    static versionCode: number | undefined;
    constructor(moduleService: ModuleTaskService);
    initTaskDepends(taskTargetService: TargetTaskService): void;
    registryAction: () => () => Promise<void>;
}
