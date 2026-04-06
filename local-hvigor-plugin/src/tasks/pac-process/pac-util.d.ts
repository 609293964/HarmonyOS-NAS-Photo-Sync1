import { PacFile, PackageJsonWithOtherInfo } from './data-structure.js';
/**
 * 检查pac.json是否包含必选字段, 当前规格为'dataProcess', 'specialAPIs'其中之一
 *
 * @param filePath
 */
export declare function checkPacJsonRequiredFields(filePath: string): boolean;
/**
 * 合并依赖项
 * @param {PackageJsonWithOtherInfo[]} packageJsonList - 需要合并的oh-package.json5列表
 * @param {PacFile} mergedPacJsonObj - 已合并的oh-package.json5对象
 * @throws {Error} 如果mergedPacJsonObj不存在dependencies属性，会抛出错误
 * @return {void}
 */
export declare function mergeDependencies(packageJsonList: PackageJsonWithOtherInfo[], mergedPacJsonObj: PacFile): void;
export declare function checkPacJsonExistAndGetObj(pacPath: string): PacFile | undefined;
export declare function pacFileValidate(moduleName: string, originalPacJsonPath: string, pacSchemaPath: string): boolean;
