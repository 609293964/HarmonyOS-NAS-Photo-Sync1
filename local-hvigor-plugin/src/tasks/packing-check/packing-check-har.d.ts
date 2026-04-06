import { OhosLogger } from '../../utils/log/ohos-logger.js';
import { TargetTaskService } from '../service/target-task-service.js';
import { OhosHarTask } from '../task/ohos-har-task.js';
/**
 * ObfuscatedHar或者ByteCodeHar在打包前，对包产物进行检查
 * originalHar里面全是源码，不需要检查
 *
 */
export declare class PackingCheckHar extends OhosHarTask {
    readonly _log: OhosLogger;
    moduleRoot: string;
    private readonly releaseWhiteListTemDir;
    private readonly byteCodeHarAbcOutputDir;
    private readonly originalEtsPath;
    private readonly packageHarTempDir;
    constructor(taskService: TargetTaskService);
    taskShouldDo(): boolean;
    protected doTaskAction(): void;
    initTaskDepends(): void;
    /**
     * 收集用于字节码HAR的ets下源代码文件。
     */
    private collectSourceCodeFilesForByteCodeHar;
    /**
     * 收集用于混淆HAR的源代码文件。
     * 检查范围：打包目录taskDir下全部文件
     * 检查规则改变：去除检查ts\js文件，并且不是.d.ets文件才命中
     */
    private collectSourceCodeFilesForObfuscatedHar;
}
