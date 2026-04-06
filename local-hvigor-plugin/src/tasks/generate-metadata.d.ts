import { ModuleBuildProfile } from '../options/build/module-build-profile.js';
import { AbstractGenerateMetadata } from './abstract/abstract-generate-metadata.js';
import { ModuleTargetData } from './data/hap-task-target-data.js';
import { TargetTaskService } from './service/target-task-service.js';
/**
 * Generate OutputMetadata Task
 */
export declare class GenerateMetadata extends AbstractGenerateMetadata {
    private _hspDepsTarget;
    constructor(targetService: TargetTaskService);
    private get jsonPath();
    private get relatedEntryJsonList();
    protected initTaskDependsForOtherModule(): void;
    protected getDistroFilterObj(relatedEntryTargetData: ModuleTargetData): ModuleBuildProfile.DistroFilterBuildOpt | undefined;
    initTaskDepends(): void;
}
