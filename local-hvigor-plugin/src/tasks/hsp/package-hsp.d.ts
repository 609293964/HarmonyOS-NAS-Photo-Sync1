import { FileSet, TaskInputValue } from '@ohos/hvigor';
import { BasePackHapTask } from '../base/base-pack-hap-task.js';
import { TargetTaskService } from '../service/target-task-service.js';
/**
 * 打包Hsp包
 *
 * @since 2023/1/17
 */
export declare class PackageHsp extends BasePackHapTask {
    constructor(taskService: TargetTaskService);
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    beforeAlwaysAction(): Promise<void>;
    protected doTaskAction(): Promise<void>;
    /**
     * har包去重场景打包hsp时设置去重后的资源路径和resources.index路径
     */
    private setHarDeduplicatePriorResourcePath;
}
