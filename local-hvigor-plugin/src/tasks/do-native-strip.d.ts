import { AbstractNativeStrip } from './abstract/abstract-native-strip.js';
import { TargetTaskService } from './service/target-task-service.js';
export declare class DoNativeStrip extends AbstractNativeStrip {
    private _log;
    private get doStrippedNativeLibs();
    constructor(targetService: TargetTaskService);
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
