import { Project } from '@ohos/hvigor';
import { CoreProjectModelImpl } from './core-project-model-impl.js';
export declare class LegacyProjectModelImpl extends CoreProjectModelImpl {
    constructor(project: Project);
    initSubModules(): void;
    getDefaultBundleName(): string;
    getBundleType(): string;
    isFaMode(): boolean;
}
