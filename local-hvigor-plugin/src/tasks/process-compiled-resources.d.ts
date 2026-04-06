import { OhosHapTask } from './task/ohos-hap-task.js';
import { TargetTaskService } from './service/target-task-service.js';
/**
 * 打包hap之前，以下场景，需要对资源进行二次处理，基于hvigor的增量机制，先拷贝resource出来，再修改：
 * 1.开启preloadSystemSo开关
 *
 * @since 2025/7/7
 */
export declare class ProcessCompiledResources extends OhosHapTask {
    private readonly resourcePath;
    private readonly preloadSoJsonPath;
    constructor(taskService: TargetTaskService);
    taskShouldDo(): boolean;
    protected beforeTask(): void;
    protected processPreloadSystemSoJson(): void;
    initTaskDepends(): void;
    protected doTaskAction(): void;
}
