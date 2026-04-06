import { ArkCompile } from './ark-compile.js';
export declare class HotReloadArkCompile extends ArkCompile {
    private readonly logger;
    protected doTaskAction(): Promise<void>;
    initTaskDepends(): void;
}
