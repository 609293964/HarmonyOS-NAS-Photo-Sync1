import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
export declare class GeneratePkgModuleJson extends OhosHapTask {
    protected readonly jsonPath: string;
    protected readonly packageHapJsonPath: string;
    private readonly preloadSoJsonPath;
    private shouldDeduplicateHar;
    constructor(taskService: TargetTaskService);
    private ensureAppStartup;
    /**
     * har包去重时hsp的module.json中添加deduplicateHar字段来标识去重
     */
    private writeDeduplicateHarField;
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
