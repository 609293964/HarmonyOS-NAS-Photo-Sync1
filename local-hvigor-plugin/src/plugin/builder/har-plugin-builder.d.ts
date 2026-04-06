import { AbstractPluginBuilder } from './abstract-plugin-builder.js';
import { Module } from '@ohos/hvigor';
import { TaskCreatorManager } from '../../tasks/task-creator.js';
import { AbstractHarModulePlugin } from '../common/abstract-har-module-plugin.js';
export declare class HarPluginBuilder extends AbstractPluginBuilder<AbstractHarModulePlugin> {
    private readonly module;
    private _creatorManager;
    constructor(module: Module, isFaMode?: boolean);
    get creatorManager(): TaskCreatorManager | undefined;
    set creatorManager(creatorManager: TaskCreatorManager | undefined);
    protected createPlugin(): AbstractHarModulePlugin;
    protected registerHooks(plugin: AbstractHarModulePlugin): void;
}
