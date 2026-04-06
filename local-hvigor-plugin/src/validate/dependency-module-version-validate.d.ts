/**
 * 查找需要修改的对象中配置的dependency
 *
 * @param ohPackageObj oh-package.json5对象
 * @param projectDir 项目目录
 * @returns 无返回值
 */
export declare function resolveJsonObjWithoutAtModule(ohPackageObj: any, projectDir: string): void;
/**
 * 检测是否配置了@module格式的源码依赖，如果找到了则返回对应的版本号
 *
 * @param originalVersion 原始配置的参数
 * @param projectDir 项目目录
 * @private
 */
export declare function resolveModuleVersion(originalVersion: string, projectDir: string): string;
