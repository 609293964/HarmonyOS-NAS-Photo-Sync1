import { FileSet, TaskDetails } from '@ohos/hvigor';
import { ProjectConfig } from '@ohos/hvigor-arkts-compose';
import { CodeType } from '../../enum/code-type-enum.js';
import { ArkCompile } from '../ark-compile.js';
import { TargetTaskService } from '../service/target-task-service.js';
/**
 * har包去重任务，har包去重时需要先编译hsp搜集到需要去重har的文件列表打到hap中
 */
export declare class CollectDuplicateHarEntriesArkCompile extends ArkCompile {
    private readonly hspNeedDeduplicateHarInfoMap;
    constructor(taskService: TargetTaskService, codeType: CodeType, taskDetails: TaskDetails);
    protected initDefaultArkCompileConfig(): Promise<ProjectConfig>;
    taskShouldDo(): boolean;
    declareOutputFiles(): FileSet;
}
