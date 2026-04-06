import { InitializationStrategy } from './initialization-strategy.js';
import { Module, Project } from '@ohos/hvigor';
import { ProjectModelImpl } from '../../model/project/project-model-impl.js';
import { AppPlugin } from '../app-plugin.js';
import { HapPlugin } from '../hap-plugin.js';
import { HspPlugin } from '../hsp-plugin.js';
import { HarPlugin } from '../har-plugin.js';
import { HapPluginBuilder } from '../builder/hap-plugin-builder.js';
import { HspPluginBuilder } from '../builder/hsp-plugin-builder.js';
import { HarPluginBuilder } from '../builder/har-plugin-builder.js';
export declare class StageInitializationStrategy extends InitializationStrategy {
    private _log;
    private cangjieObj;
    constructor();
    createAppPlugin(project: Project): AppPlugin;
    createHapPlugin(module: Module, pluginBuilder: HapPluginBuilder): HapPlugin;
    createHspPlugin(module: Module, pluginBuilder: HspPluginBuilder): HspPlugin;
    createHarPlugin(module: Module, pluginBuiler: HarPluginBuilder): HarPlugin;
    /**
     * 创建工程模型
     *
     * @param module - 模块对象
     * @returns 返回项目模型实例
     */
    createProjectModel(module: Module): ProjectModelImpl;
    /**
     * 初始化插件模型等参数
     *
     * @param plugin - 抽象模块插件对象
     * @param module - 模块对象
     * @param isHapModule - 是否为HAP模块的标志
     * @returns 返回初始化后的抽象模块插件
     */
    private initPluginParam;
    /**
     * 设置模块插件的构建配置、任务等信息
     *
     * @param plugin - 抽象模块插件对象
     * @param module - 模块对象
     */
    private setUpModulePlugin;
}
