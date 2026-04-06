import { AppPlugin } from '../app-plugin.js';
/**
 * 用于处理与ohpm相关的加载和安装任务。
 */
export declare class OhpmLoadInstallService {
    private _log;
    /**
     *
     * @param appPlugin
     */
    ohpmLoadInstall(appPlugin: AppPlugin): void;
    private ohpmLoadInstallForBuild;
    /**
     *
     * @protected
     */
    protected isOnlyCleanTask(): boolean;
}
