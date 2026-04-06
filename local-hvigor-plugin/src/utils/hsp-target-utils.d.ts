import { ModuleTargetData } from '../tasks/data/hap-task-target-data.js';
import { TargetTaskService } from '../tasks/service/target-task-service.js';
export declare class HspTargetUtils {
    private static _log;
    /**
     * 获取依赖的hsp模块的可用target,这个获取的是所有直接依赖的本地hsp
     *
     * @param targetService
     */
    static calDepHspTargets(targetService: TargetTaskService): Map<string, ModuleTargetData>;
    private static getHspTargetDatas;
    /**
     * 获取传入的hspModuleNames的可用target。目前只有去重场景会使用这个方法，去重场景需要获取到hap依赖的所有本地hsp(直接+间接)。
     *
     * @param targetService targetService
     * @param hspModuleNames hsp moduleNames
     */
    static calHspTargets(targetService: TargetTaskService, hspModuleNames: string[]): Map<string, ModuleTargetData>;
}
