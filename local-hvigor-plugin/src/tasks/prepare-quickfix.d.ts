import { TargetTaskService } from './service/target-task-service.js';
import { OhosHapTask } from './task/ohos-hap-task.js';
export declare class PrepareQuickfix extends OhosHapTask {
    private readonly libsDir;
    private readonly debugSymbol?;
    private readonly libsCachePath;
    private readonly lastCachePath;
    private readonly patchConfig?;
    constructor(taskService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    collectNativeLibs(): Promise<Record<string, number>>;
    collectResources(): Promise<void>;
    copyResources(patchResPath: string, fileArr?: ModifiedResourcePath[]): Promise<void>;
    collectEts(): Promise<boolean[]>;
    private logQuickfixChanges;
    compareLibs(base: Record<string, string>, last: Record<string, string>, current: Record<string, string>): Record<string, number>;
    generatePatchJson(): Promise<void>;
    initTaskDepends(): void;
    /**
     * 用于根据buildConfig文件里的mode判断重载类型
     * 值：hotReload coldReload
     */
    getPatchConfigMode(): any;
    /**
     * obj里存在长度大于1的数组就返回true
     * @param {string[] | object} obj
     * @returns {boolean}
     */
    isChanged(obj: string[] | object): boolean;
    static getCurrentHqfVersion(): Promise<number>;
}
export interface PatchJson {
    app: PatchApp;
    module: PatchModule;
}
export interface HotReloadPatchJson {
    app: HotReloadPatchApp;
    module: HotReloadPatchModule;
}
export interface PatchApp {
    bundleName: string;
    versionCode: number;
    versionName: string;
    patchVersionCode: number;
    patchVersionName: string;
}
export interface PatchModule {
    name: string;
    type: string;
    deviceTypes: string[];
    originalModuleHash: string;
}
export interface HotReloadPatchApp {
    bundleName: string;
    patchVersionCode: number;
    versionCode: number;
}
export interface HotReloadPatchModule {
    name: string;
    type: string;
}
export interface Quickfix {
    changes: Record<string, number>;
    state: number;
    file: string;
}
export interface ChangeFileListObj {
    resources?: ResourcesObj;
}
interface ModifiedResourcePath {
    filePath: string;
    resourcePath: string;
}
export interface ResourcesObj {
    resFile?: ModifiedResourcePath[];
    rawFile?: ModifiedResourcePath[];
}
export {};
