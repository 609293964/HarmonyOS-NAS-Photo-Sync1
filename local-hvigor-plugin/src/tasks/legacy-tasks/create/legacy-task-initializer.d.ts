import { Module } from '@ohos/hvigor';
import { AbstractModulePlugin } from '../../../plugin/common/abstract-module-plugin';
import { AbstractModuleHookTask } from '../../hook/abstract-module-hook-task';
import { ModuleTaskService } from '../../service/module-task-service';
import { TargetTaskService } from '../../service/target-task-service';
export declare const legacyHapTasksInitialize: (plugin: AbstractModulePlugin) => void;
export declare const legacyHarTasksInitialize: (plugin: AbstractModulePlugin) => void;
export declare const legacyCommonHooksInitialize: (moduleTaskService: ModuleTaskService) => AbstractModuleHookTask[];
export declare const legacyTasksInitialize: (module: Module, service: TargetTaskService) => void;
