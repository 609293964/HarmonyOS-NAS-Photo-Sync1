import { OhosPackageJson } from '../../utils/dependency-util.js';
/**
 * 为FA模型支持管理har的依赖
 */
export declare class LegacyDependencyManagerHelper {
    private readonly _moduleName;
    constructor(moduleName: string);
    /**
     * 过config.json/module.json5判断当前模块是否与FA模型兼容
     * @param pkgPath 当前模块的路径
     * @param devPkgJsonObj
     */
    checkHspOrHarStatusForFAByProfile(pkgPath: string, devPkgJsonObj: OhosPackageJson): boolean;
    /**
     * 判断依赖的包与本FA模块是否兼容, 需要传入module.json或module.json5路径
     * @param runtimeJson 传入module.json或module.json5路径
     * @param devPkgJsonObj
     */
    checkHspOrHarStatusForFA(runtimeJson: string, devPkgJsonObj: OhosPackageJson): boolean;
}
