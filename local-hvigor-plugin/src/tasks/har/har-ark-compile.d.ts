import { TaskDetails, TaskInputValue, FileSet } from '@ohos/hvigor';
import { ProjectConfig } from '@ohos/hvigor-arkts-compose';
import { CodeType } from '../../enum/code-type-enum.js';
import { OhosLogger } from '../../utils/log/ohos-logger.js';
import { ArkCompile } from '../ark-compile.js';
import { TargetTaskService } from '../service/target-task-service.js';
export declare class HarArkCompile extends ArkCompile {
    protected _log: OhosLogger;
    constructor(taskService: TargetTaskService, codeType: CodeType, taskDetails: TaskDetails);
    protected allowToPreloadSystemSo(): boolean;
    protected addPreloadSystemSoFileList(): void;
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    protected doTaskAction(): Promise<void>;
    protected initDefaultArkCompileConfig(): Promise<ProjectConfig>;
    initTaskDepends(): void;
    private getDependencyKeysByPkgPath;
    private getDependencyKeys;
}
