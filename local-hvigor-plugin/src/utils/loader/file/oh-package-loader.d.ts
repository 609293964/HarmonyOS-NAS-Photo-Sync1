declare class OhPackageLoader {
    private readonly _log;
    isUpdatedOhPackageInfo: boolean;
    private isLoaded;
    isChangedParameterFile: boolean;
    OhPackagePathMap: Map<string, string>;
    UpdatePathToOriginMap: Map<string, string>;
    getDependenciesOpt(nodeOhPackagePath: string): any;
    clean(): void;
    getDevDependenciesOpt(nodeOhPackagePath: string): any;
    getDynamicDependenciesOpt(nodeOhPackagePath: string): any;
    getOhPackageJsonObj(nodeOhPackagePath: string): Record<string, any> | undefined;
    setDependenciesOpt(nodeOhPackagePath: string, dependencies: any): void;
    setDevDependenciesOpt(nodeOhPackagePath: string, devDependencies: any): void;
    setDynamicDependenciesOpt(nodeOhPackagePath: string, dynamicDependencies: any): void;
    getVersion(nodeOhPackagePath: string): any;
    setVersion(nodeOhPackagePath: string, updateVersion: string): void;
    /**
     * 判断是否需要执行ohpm install
     * 1.是否更新oh-package.json5文件
     * 2.是否更新parameterFile文件
     * 3.是否使用includeNode及excludeNodeByName等api动态修改配置
     */
    shouldDoOhpmInstall(): boolean;
    loadUpdatedOhPackageToDisk(targetName: string, newParameterFile?: string): void;
    getNodeOhPackagePath(path: string): string;
    private saveOhPackagePathInfoToLoader;
    private validateDependency;
    getOriginPathFromUpdatePath(paths: string[]): string[];
    setIsChangeParameterFile(targetName: string, newParameterFile?: string): void;
    /**
     * 获取overrides
     * @param nodeOhPackagePath
     */
    getOverrides(nodeOhPackagePath: string): any;
    /**
     * 设置overrides
     * @param nodeOhPackagePath
     * @param overrides
     */
    setOverrides(nodeOhPackagePath: string, overrides: any): void;
}
export interface DependencyMap {
    targetName: string | undefined;
    rootDependency: string;
    dependencyMap: Record<string, string>;
    modules: HvigorModule[];
    basePath: string;
}
type HvigorModule = {
    name: string;
    srcPath: string;
};
export declare const ohPackageLoader: OhPackageLoader;
export {};
