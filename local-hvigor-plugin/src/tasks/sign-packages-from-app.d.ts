import { FileSet, Project, TaskInputValue } from '@ohos/hvigor';
import { SignTypeEnum } from '../enum/sign-type-enum.js';
import { ProjectBuildProfile } from '../options/build/project-build-profile.js';
import { BasePackAppTask } from './base/base-pack-app-task.js';
import { ProjectTaskService } from './service/project-task-service.js';
import { SignUtil } from './sign/sign-util.js';
import SigningConfigBuildOpt = ProjectBuildProfile.SigningConfigBuildOpt;
/**
 * 生成 xxx-all-signed.app
 *
 * @since 2022/1/10
 */
export declare class SignPackagesFromApp extends BasePackAppTask {
    private readonly curProduct;
    private readonly defaultPackageLimitSize;
    private readonly pacJsonFilePath;
    private readonly appFilePath;
    private readonly allAppFilePath;
    private readonly allSignedAppFilePath;
    private readonly isSigned;
    private readonly moduleSignType;
    private readonly unPackTool;
    protected readonly signUtil: SignUtil;
    protected readonly signingConfig: SigningConfigBuildOpt | undefined;
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    declareOutputFiles(): FileSet;
    constructor(project: Project, taskService: ProjectTaskService);
    initTaskDepends(): void;
    get appWithSignedPkg(): boolean;
    protected doTaskAction(): Promise<void>;
    /**
     * 打包成all-unsigned.app
     * @param hapFileList
     * @param hspFileList
     * @private
     */
    private packAllAppPackage;
    /**
     * 对上一步拆包app里的所有hap和hsp循环签名
     * @param unzipAppFilePath
     * @private
     */
    private signAllHapsAndHsps;
    private submitSignWorker;
    /**
     * 对app包进行拆包
     * @private
     */
    private unpackAppPackage;
    /**
     * 获得打包app的命令
     * @returns {string[]} 打包app的命令
     */
    private getPackAppCommand;
    private deleteOldAllAppPackages;
}
export interface SignPackageConfig {
    signCommand: string[];
    projectName: string;
    signType: SignTypeEnum;
}
