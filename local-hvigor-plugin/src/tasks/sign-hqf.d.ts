import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
export declare class SignHqf extends OhosHapTask {
    private readonly _log;
    constructor(taskService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
    private updateQuickfixLog;
    /**
     * 用于根据buildConfig文件里的mode判断重载类型
     * 值：hotReload coldReload
     */
    getPatchConfigMode(): any;
}
