import { AbstractPluginBuilder } from './abstract-plugin-builder.js';
import { Module } from '@ohos/hvigor';
import { TaskCreatorManager } from '../../tasks/task-creator.js';
import { HspPlugin } from '../hsp-plugin.js';
export declare class HspPluginBuilder extends AbstractPluginBuilder<HspPlugin> {
    private readonly module;
    private _creatorManager;
    constructor(module: Module, isFaMode?: boolean);
    get creatorManager(): TaskCreatorManager | undefined;
    set creatorManager(creatorManager: TaskCreatorManager | undefined);
    protected createPlugin(): HspPlugin;
    protected registerHooks(plugin: HspPlugin): void;
    /**
     * 初始化HSP插件的ohosConfig数据。
     *
     * @param module - 需要初始化的模块对象。
     * @returns 无返回值。
     */
    initHspPluginGlobalData(module: Module): void;
}
