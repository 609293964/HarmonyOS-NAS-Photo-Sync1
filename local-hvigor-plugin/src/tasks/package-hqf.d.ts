import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
export declare class PackageHqf extends OhosHapTask {
    private readonly _log;
    constructor(targetService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    getHotReloadCommand(): string[];
    getColdReloadCommand(): string[];
    /**
     * 用于根据buildConfig文件里的mode判断重载类型
     * 值：hotReload coldReload
     */
    getPatchConfigMode(): any;
    initTaskDepends(): void;
}
