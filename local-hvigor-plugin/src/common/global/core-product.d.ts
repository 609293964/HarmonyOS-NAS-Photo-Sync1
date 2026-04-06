import { ProjectModel } from '../../model/project/project-model.js';
import { ProjectBuildProfile } from '../../options/build/project-build-profile.js';
import { Product } from '../../plugin/context/plugin-context.js';
import ProductBuildOpt = ProjectBuildProfile.ProductBuildOpt;
export declare class CoreProduct implements Product {
    private productBuildOpt;
    private productName;
    private bundleName;
    private bundleType;
    private projectModel;
    private outputArtifactName;
    constructor(productBuildOpt: ProductBuildOpt, projectModel: ProjectModel);
    transformToCoreProduct(): void;
    getBundleName(): string;
    private _getBundleName;
    getBundleType(): string;
    private _getBundleType;
    getProductName(): string;
    private _getProductName;
    getOutputArtifactName(): string | undefined;
    private _getOutputArtifactName;
}
