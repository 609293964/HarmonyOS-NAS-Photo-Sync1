import { PathDetails } from '../../external/path/path-details.js';
import { SdkDetails } from '../../external/sdk/sdk-details.js';
import { BuildOption } from '../../options/build/hap-ohos-config.js';
import { ModuleBuildProfile } from '../../options/build/module-build-profile.js';
import { ProjectBuildProfile } from '../../options/build/project-build-profile.js';
import { AppJson } from '../../options/configure/app-json-options.js';
import { ModuleJson } from '../../options/configure/module-json-options.js';
/**
 * Project级别的Plugins上下文信息
 */
export interface OhosProjectContext {
    getProjectName: () => string;
    getProjectPath: () => string;
    getBuildRootPath: () => string;
    getBuildProductOutputPath: () => string;
    getCurrentProduct: () => Product;
    getBuildMode: () => string;
    getOhpmDependencyInfo: () => Record<string, OhpmDependencyInfo> | object;
    getOhpmRemoteHspDependencyInfo: (isSigned: boolean | undefined) => Record<string, OhpmDependencyInfo>;
    getBuildProfileOpt: () => ProjectBuildProfile.ProjectProfileOpt;
    setBuildProfileOpt: (buildProfileOpt: ProjectBuildProfile.ProjectProfileOpt) => void;
    getAppJsonOpt: () => AppJson.AppOptObj;
    setAppJsonOpt: (appJsonOpt: AppJson.AppOptObj) => void;
    getDependenciesOpt: () => any;
    getDevDependenciesOpt: () => any;
    getDynamicDependenciesOpt: () => any;
    setDependenciesOpt: (dependencies: any) => void;
    setDevDependenciesOpt: (devDependencies: any) => void;
    setDynamicDependenciesOpt: (dynamicDependencies: any) => void;
    getOverrides: () => any;
    setOverrides: (overrides: any) => void;
    getSdkDetails: () => SdkDetails;
    isDebugLineEnable: () => boolean;
    getAllModuleNameHash: () => string;
    getFastBuildApp: () => boolean;
    getAppWithSignedPkg: () => boolean;
}
export interface Product {
    getProductName: () => string;
    getBundleType: () => string;
    getBundleName: () => string;
    getOutputArtifactName: () => string | undefined;
}
/**
 * Module级别的Plugin上下文信息
 */
export interface OhosModuleContext {
    getModuleName: () => string;
    getModulePath: () => string;
    getModuleType: () => string;
    getBuildProductRootPath: () => string;
    targets: (callback: (target: Target) => void) => void;
    getOhpmDependencyInfo: () => Record<string, OhpmDependencyInfo>;
    getOhpmRemoteHspDependencyInfo: (isSigned: boolean) => Record<string, OhpmDependencyInfo>;
    getBuildProfileOpt: () => ModuleBuildProfile.ModuleBuildOpt;
    setBuildProfileOpt: (buildProfileOpt: ModuleBuildProfile.ModuleBuildOpt) => void;
    getModuleJsonOpt: () => ModuleJson.ModuleOptObj;
    setModuleJsonOpt: (moduleJsonOpt: ModuleJson.ModuleOptObj) => void;
    getDependenciesOpt: () => any;
    getDevDependenciesOpt: () => any;
    getDynamicDependenciesOpt: () => any;
    setDependenciesOpt: (dependencies: any) => void;
    setDevDependenciesOpt: (devDependencies: any) => void;
    setDynamicDependenciesOpt: (dynamicDependencies: any) => void;
    getVersion: () => string;
    setVersion: (version: string) => void;
    loadCompilePlugin: (path: string) => void;
    getBuildMode: () => string;
    getTargetArtifactNames: () => Map<string, string>;
    getTargetArtifactName: (targetName: string) => string | undefined;
}
export interface OhpmDependencyInfo {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    packagePath: string;
    remoteHspPath?: string;
    signedRemoteHspPath?: string;
}
export interface DependRemoteHspInfo extends OhpmDependencyInfo {
    soPath?: string;
}
export interface Target {
    getCurrentProduct: () => Product;
    getBuildTargetOutputPath: () => string;
    getTargetName: () => string;
    getBuildOption: () => BuildOption;
    getModulePathDetails: () => PathDetails;
}
export type OhosAppContext = OhosProjectContext;
export type OhosHapContext = OhosModuleContext;
export type OhosHspContext = OhosModuleContext;
export type OhosHarContext = OhosModuleContext;
