import { AbstractPluginBuilder } from './abstract-plugin-builder.js';
import { Module } from '@ohos/hvigor';
import { TaskCreatorManager } from '../../tasks/task-creator.js';
import { AbstractHapModulePlugin } from '../common/abstract-hap-module-plugin.js';
export declare class HapPluginBuilder extends AbstractPluginBuilder<AbstractHapModulePlugin> {
    private readonly module;
    private _creatorManager;
    constructor(module: Module, isFaMode?: boolean);
    get creatorManager(): TaskCreatorManager | undefined;
    set creatorManager(creatorManager: TaskCreatorManager | undefined);
    protected createPlugin(): AbstractHapModulePlugin;
    protected registerHooks(plugin: AbstractHapModulePlugin): void;
}
