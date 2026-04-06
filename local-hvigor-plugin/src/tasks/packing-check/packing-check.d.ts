import { OhosLogger } from '../../utils/log/ohos-logger.js';
import { TargetTaskService } from '../service/target-task-service.js';
import { OhosHapTask } from '../task/ohos-hap-task.js';
/**
 * Hap/Hsp模块在打包前，对包产物进行检查
 *
 */
export declare class PackingCheck extends OhosHapTask {
    readonly _log: OhosLogger;
    private readonly etsAssetsPath;
    private readonly etsOriginalPath;
    private readonly intermediateResourceDir;
    constructor(taskService: TargetTaskService);
    taskShouldDo(): boolean;
    protected doTaskAction(): void;
    initTaskDepends(): void;
}
