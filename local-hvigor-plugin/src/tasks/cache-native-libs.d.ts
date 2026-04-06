import { AbstractNativeStrip } from './abstract/abstract-native-strip.js';
import { TargetTaskService } from './service/target-task-service.js';
/**
 * build-native-strip任务执行完执行这个任务把本次的strip结果落盘保存
 */
export declare class CacheNativeLibs extends AbstractNativeStrip {
    private logger;
    private get cacheStrippedNativeLibs();
    private get buildCacheFilePath();
    constructor(targetService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
