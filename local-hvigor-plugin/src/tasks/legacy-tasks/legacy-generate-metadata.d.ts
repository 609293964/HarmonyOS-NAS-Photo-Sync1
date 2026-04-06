import { ModuleBuildProfile } from '../../options/build/module-build-profile.js';
import { AbstractGenerateMetadata } from '../abstract/abstract-generate-metadata.js';
import { ModuleTargetData } from '../data/hap-task-target-data.js';
import { TargetTaskService } from '../service/target-task-service.js';
/**
 * Legacy Generate OutputMetadata Task
 */
export declare class LegacyGenerateMetadata extends AbstractGenerateMetadata {
    private readonly configJsonPath;
    private get relatedEntryJsonList();
    constructor(targetService: TargetTaskService);
    protected getDistroFilterObj(relatedEntryTargetData: ModuleTargetData): ModuleBuildProfile.DistroFilterBuildOpt | undefined;
}
