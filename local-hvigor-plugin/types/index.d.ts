/// <reference types='node' />

declare enum AbilityTypeEnum {
    PAGE = 'page',
    DATA = 'data',
    SERVICE = 'service',
    FORM = 'form',
    TEST_RUNNER = 'testrunner',
    WORKER = 'worker'
}

declare namespace AbilityTypeEnum {
    function valueOf(abilityObj: ConfigJson.AbilitiesObj): AbilityTypeEnum;
}

/**
 * 对外暴露hap级别的接口和任务的plugin
 *
 * @since 2021/12/16
 */
export declare abstract class AbstractHapModulePlugin extends AbstractModulePlugin {
    protected buildPreviewerRes: BuildPreviewerRes | undefined;
    protected previewBuild: PreviewBuild | undefined;
    protected unitTestBuild: UnitTestBuild | undefined;
    assembleHap: AssembleHap | undefined;
    protected constructor(module: Module);
    abstract initHapTasks(): void;
    initGlobalData(): void;
}

/**
 * 对外暴露hap级别的接口和任务的plugin
 *
 * @since 2021/12/16
 */
export declare abstract class AbstractHarModulePlugin extends AbstractModulePlugin {
    protected assembleHar: AssembleHar | undefined;
    protected buildHarPreviewerRes: BuildHarPreviewerRes | undefined;
    protected previewBuild: PreviewBuild | undefined;
    protected unitTestBuild: UnitTestBuild | undefined;
    protected constructor(module: Module);
    abstract initHarTasks(): void;
    initGlobalData(): void;
}

/**
 * 继承此类的都是以module为基础，提供的hook task，不区分不同的target
 *
 * @since 2022/8/11
 */
declare abstract class AbstractModuleHookTask extends DefaultTask {
    protected readonly _moduleService: ModuleTaskService;
    protected readonly _isFaMode: boolean;
    protected constructor(moduleService: ModuleTaskService, isFaMode: boolean, taskName: TaskDetails);
    registryAction: () => Function;
    abstract initTaskDepends(taskTargetService: TargetTaskService): void;
}

/**
 * hap模块的抽象接口
 *
 * @since 2022/1/20
 */
declare abstract class AbstractModulePlugin extends HvigorSystemPlugin {
    private _log;
    protected _module: Module;
    protected _projectModel: ProjectModel | undefined;
    protected _moduleModel: ModuleModel | undefined;
    protected _moduleService: ModuleTaskService | undefined;
    protected _configFileName: string | undefined;
    protected _needExecTargetServiceList: TargetTaskService[];
    protected _pluginApiType: string | undefined;
    protected ohosModuleContext: OhosModuleContext | undefined;
    protected readonly moduleName: string | undefined;
    clean: Clean | undefined;
    compileNative: CompileNativeHook | undefined;
    sync: SyncModule | undefined;
    protected constructor(pluginId: string, module: Module);
    refreshTargetServiceList(): void;
    getContext(): OhosModuleContext;
    initContext(): void;
    withProjectModel(projectModel: ProjectModel): this;
    getProjectModel(): ProjectModel | undefined;
    withModuleModel(moduleModel: ModuleModel): this;
    getModuleModel(): ModuleModel | undefined;
    getModuleName(): string | undefined;
    withPluginApiType(pluginApiType: ApiType): this;
    withRuntimeConfigFileName(runtimeFileName: string): this;
    initModuleTaskService(isFaMode: boolean): void;
    initBuildOptionMap(path: string): void;
    doModuleInspection(): void;
    getNeedExecTargetServiceList(): TargetTaskService[];
    /**
     * 初始化获取当前模块有哪些target需要创建任务流，并挂接在hook任务上
     * 1. 如果当前模块所有target都与指定的product不匹配，则报一个warn
     *
     */
    initTargetDepends(): void;
    /**
     * 初始化 公共的与target无关的任务
     *
     * @private
     */
    initModuleCommonTasks(): void;
    initModuleCommonTasksForDiffApiType(isFaMode: boolean): void;
    protected initTaskDependsForAllNeedExecTarget(...tasks: AbstractModuleHookTask[]): void;
    /**
     * 校验Module Target配置
     */
    private checkModuleTarget;
    /**
     * 检查hvigor命令行中配置的target
     */
    checkHvigorCommandTarget(): void;
    /**
     * 校验已配置、或默认的target源码目录下的配置文件
     */
    private checkTargetSourceCodeConfigFile;
    /**
     * 校验module文件配置与module工程模型是否有差异
     *
     * @private
     */
    checkModuleConfigStatus(): void;
    /**
     * ohosTest Target规格校验
     */
    checkOhosTestTarget(): void;
    getTaskService(): ModuleTaskService | undefined;
}

declare abstract class AbstractPreviewerRes extends AbstractModuleHookTask {
    protected syscapJsonPath: string;
    protected constructor(moduleService: ModuleTaskService, isFaMode: boolean);
}

/**
 * 对外暴露app级别的接口和任务的plugin
 *
 * @since 2021/12/16
 */
declare abstract class AbstractProjectPlugin extends HvigorSystemPlugin {
    protected _projectName: string;
    protected _projectModel: ProjectModel | undefined;
    protected _taskService: ProjectTaskService | undefined;
    protected ohosAppContext: OhosAppContext | OhosProjectContext | undefined;
    _project: Project;
    assembleApp: AssembleApp | undefined;
    clean: Clean | undefined;
    syncProject: SyncProject | undefined;
    protected constructor(project: Project);
    abstract initTaskService(): void;
    doRegisterTask(): void;
    doProjectInspection(): void;
    initBuildOptionMap(path: string): void;
    initTraceData(): void;
    initGlobalData(): void;
    getTaskService(): ProjectTaskService | undefined;
    getProjectModel(): ProjectModel | undefined;
    initContext(): void;
    getContext(): OhosAppContext | undefined;
}

declare enum AotCompileModeEnum {
    AOT_NULL = '',
    AOT_TYPE = 'type',
    AOT_PARTIAL = 'partial',
    BUILD_PROFILE = 'build-profile.json5',
    AN = 'an',
    ARM64_V8A = 'arm64-v8a'
}

/**
 * 支持的不同工程模型状态
 *
 * @since 2022/1/18
 */
declare enum ApiType {
    FA = 'faMode',
    STAGE = 'stageMode'
}

export declare namespace AppJson {
    interface DeviceConfigurationObj extends Option_2 {
        minAPIVersion?: number;
        distributedNotificationEnabled?: boolean;
        keepAlive?: boolean;
        removable?: boolean;
        singleton?: boolean;
        userDataClearable?: boolean;
        accessible?: boolean;
    }
    interface AppObj extends Option_2 {
        debug?: boolean;
        bundleName: string;
        vendor?: string;
        bundleType?: string;
        versionCode: number;
        versionName: string;
        minCompatibleVersionCode?: number;
        minAPIVersion?: number | string;
        targetAPIVersion?: number | string;
        apiReleaseType?: string;
        icon?: string;
        label?: string;
        distributedNotificationEnabled?: boolean;
        singleUser?: boolean;
        description?: string;
        entityType?: string;
        keepAlive?: boolean;
        removable?: boolean;
        singleton?: boolean;
        userDataClearable?: boolean;
        accessible?: boolean;
        multiProjects?: boolean;
        targetBundleList?: string[];
        default?: DeviceConfigurationObj;
        tablet?: DeviceConfigurationObj;
        tv?: DeviceConfigurationObj;
        car?: DeviceConfigurationObj;
        wearable?: DeviceConfigurationObj;
        router?: DeviceConfigurationObj;
        asanEnabled?: boolean;
        tsanEnabled?: boolean;
        hwasanEnabled?: boolean;
        ubsanEnabled?: boolean;
        compileSdkVersion?: string;
        configuration?: string;
        targetMinorAPIVersion?: number;
        targetPatchAPIVersion?: number;
    }
    interface AppOptObj {
        app: AppObj;
    }
}

/**
 * 对外暴露app级别的接口和任务的plugin
 *
 * @since 2021/12/16
 */
export declare class AppPlugin extends AbstractProjectPlugin {
    constructor(project: Project);
    initTaskService(): void;
}

/**
 * Stage模型的app插件
 *
 * @param module hvigorProject
 */
export declare const appTasks: (module: Project) => AppPlugin;

declare interface ArkOptions {
    aotCompileMode?: AotCompileModeEnum;
    apPath?: string;
    hostPGO?: boolean;
    types?: string[];
    compilePluginFile?: string;
    buildProfileFields?: object;
    runtimeOnly?: RuntimeOnlyObj;
    integratedHsp?: boolean;
    tscConfig?: TscConfig;
    branchElimination?: boolean;
    transformLib?: string | undefined;
    byteCodeHar?: boolean;
    bundledDependencies?: boolean;
    autoLazyImport?: boolean;
    reExportCheckMode?: string;
    packSourceMap?: boolean;
    skipOhModulesLint?: boolean;
    expandImportPath?: ExpandImportPath;
    autoLazyFilter?: AutoLazyFilter;
}

declare type ArkOptionsOpt = {
    aotCompileMode?: AotCompileModeEnum;
    apPath?: string;
    hostPGO?: boolean;
    types?: string[];
    compilePluginFile?: string;
    buildProfileFields?: object;
    runtimeOnly?: RuntimeOnlyObj;
    transformLib?: string;
};

declare namespace ArkUIXConfigJson {
    interface ConfigObj {
        crossplatform: boolean;
        modules: string[];
        buildOption?: {
            resConfigs?: string[];
            ignoreCrossPlatform?: boolean;
        };
    }
}

/**
 * 组装打包app的任务流
 *
 * @since 2022/1/20
 */
declare class AssembleApp extends DefaultTask {
    private readonly _taskService;
    constructor(project: Project, taskService: ProjectTaskService);
    private initTaskDepends;
    registryAction: () => () => void;
}

/**
 * 组装Hap打包的任务流
 *
 * @since 2022/1/20
 */
declare class AssembleHap extends AbstractModuleHookTask {
    constructor(moduleService: ModuleTaskService, isFaMode: boolean);
    initTaskDepends(taskTargetService: TargetTaskService): void;
    /**
     * 是否跳过生成带签名的hap的步骤
     *
     * @private
     */
    private skipSignHap;
}

/**
 * 组装Hap打包的任务流
 *
 * @since 2022/1/20
 */
declare class AssembleHar extends AbstractModuleHookTask {
    constructor(moduleService: ModuleTaskService, isFaMode: boolean);
    initTaskDepends(taskTargetService: TargetTaskService): void;
}

declare interface AutoLazyFilter {
    exclude?: string[];
    include?: string[];
}

declare class BaseEvent {
    protected head: EventHead;
    protected body: EventBody;
    protected additional: EventAdditional;
    constructor(head: EventHead, body: EventBody);
    setStartTime(time?: number): void;
    setEndTime(time?: number): void;
    setTotalTime(time: number): void;
    getId(): string;
    getName(): string;
    getDescription(): string;
    setName(name: string): void;
    getType(): MetricEventType;
    setType(type: MetricEventType): void;
    getTid(): string;
    setTid(tid: string): this;
}

/**
 * 定义一个返回boolean的回调函数类型
 */
declare type BooleanCallback = (...args: any[]) => boolean;

/**
 * for previewer hook only
 *
 * @since 2022/8/11
 */
declare class BuildHarPreviewerRes extends AbstractPreviewerRes {
    constructor(moduleService: ModuleTaskService, isFaMode: boolean);
    initTaskDepends(taskTargetService: TargetTaskService): void;
}

declare interface BuildOpt extends ProjectBuildOpt, ModuleBuildOpt {
    removePermissions?: RequiredNamed[];
}

declare type BuildOption = {
    resOptions?: ResOptions;
    externalNativeOptions?: ExternalNativeOptions;
    sourceOption?: SourceOption;
    napiLibFilterOption?: NapiLibFilterOption;
    arkOptions?: ArkOptionsOpt;
    nativeLib?: NativeLib_2;
};

declare interface BuildOptionWithName extends Named, BuildOpt {
    copyFrom?: string;
}

/**
 * for previewer hook only in hap module
 *
 * @2022/8/11
 */
declare class BuildPreviewerRes extends AbstractPreviewerRes {
    constructor(moduleTaskService: ModuleTaskService, isFaMode: boolean);
    initTaskDepends(taskTargetService: TargetTaskService): void;
}

declare interface CangjieOpt extends Option_2 {
    path?: string;
}

/**
 * 用于给需要区分真实对象类型设置的一个属性
 *
 * @since 2022/6/20
 */
declare interface Class {
    classKind: string;
}

/**
 * module级别的clean
 *
 * @since 2022/1/10
 */
declare class Clean extends DefaultTask {
    private readonly _taskService;
    private _logger;
    constructor(node: HvigorCoreNode, taskService: TaskService);
    nativeClean: (sdkInfo: SdkInfo | undefined) => void;
    tryCatchExecute: (commands: string[], warns: string[], archDir: string, processUtils: ProcessUtils) => void;
    getArchDirectories: (directoryPath: string, archDirectories: string[], taskService: ModuleTaskService) => void;
    private pushArchDirectories;
    private isDirectory;
    private resetRemoteHspCache;
    registryAction: () => Function;
    clean: (buildDir: string, testBuildDir?: string) => Promise<void>;
    terminateWorkerPool: () => Promise<void>;
    rmdirSyncWithBuildDir: (buildDir: string) => boolean;
    rmdirSync: (dirPath: string, hasError: boolean) => boolean;
}

declare interface CodeModel {
    /**
     * 获取该源码的路径
     */
    getSrcPath: () => string;
    /**
     * 获取该源码的类型
     */
    getCodeType: () => CodeType;
}

declare enum CodeType {
    JS = 'js',
    ETS = 'ets',
    CPP = 'cpp'
}

/**
 * 为枚举类附加特定方法
 *
 * @since 2022/1/26
 */
declare namespace CodeType {
    function getSDKComponentName(codeType: CodeType): string;
}

declare interface CommonModuleBuildOpt extends Option_2 {
    externalNativeOptions?: ExternalNativeOpt;
    napiLibFilterOption?: NapiLibFilterOpt;
    arkOptions?: ArkOptions;
    nativeLib?: NativeLib;
    strictMode?: StrictMode;
    cangjieOptions?: CangjieOpt;
    resOptions?: {
        compression?: RestoolCompressionConfig;
        copyCodeResource?: CopyCodeResource;
        resCompileThreads?: number;
        ignoreResourcePattern?: string[];
        qualifiersConfig?: QualifiersConfig;
        includeAppScopeRes?: boolean;
        excludeHarRes?: string[];
        idDefinedFilePath?: string;
        [key: string]: any;
    };
    nativeCompiler?: string;
}

declare enum CompileModeEnum {
    JS_BUNDLE = 'jsbundle',
    ES_MODULE = 'esmodule'
}

/**
 * 暴露给其他模块使用的hook任务,任务名不可更改
 *
 * @since 2022/5/13
 */
declare class CompileNativeHook extends AbstractModuleHookTask {
    constructor(moduleService: ModuleTaskService);
    initTaskDepends(taskTargetService: TargetTaskService): void;
}

/**
 * LoaderProfile对象
 */
declare interface Config {
    getObject: (name: string) => any;
    setObject: (name: string, obj: object) => void;
}

declare namespace ConfigJson {
    interface AppObj extends Option_2 {
        bundleName: string;
        vendor?: string;
        apiVersion?: ApiVersionObj;
        version: VersionObj;
        type?: string;
        targetBundleList?: string[];
        relatedBundleName?: string;
        smartWindowSize?: string;
        smartWindowDeviceType?: string[];
        singleton?: boolean;
        removable?: boolean;
        userDataClearable?: boolean;
        asanEnabled?: boolean;
        tsanEnabled?: boolean;
        hwasanEnabled?: boolean;
        ubsanEnabled?: boolean;
    }
    interface ApiVersionObj extends Option_2 {
        compatible?: number;
        target?: number;
        releaseType?: string;
    }
    interface VersionObj extends Named {
        code: number;
        minCompatibleVersionCode?: number;
    }
    interface DeviceConfigObj extends Option_2 {
        [propName: string]: DeviceConfigOptionObj;
    }
    interface DeviceConfigOptionObj extends Option_2 {
        jointUserId?: string;
        process?: string;
        ark?: ArkObj;
        keepAlive?: boolean;
        directLaunch?: boolean;
        network?: NetworkObj;
        supportBackup?: boolean;
        compressNativeLibs?: boolean;
        allowComponentsProxy?: boolean;
        debug?: boolean;
    }
    interface ArkObj extends Option_2 {
        reqVersion?: ReqVersionObj;
        flag?: string;
    }
    interface ReqVersionObj extends Option_2 {
        compatible?: number;
        target?: number;
    }
    interface NetworkObj extends Option_2 {
        cleartextTraffic?: boolean;
        securityConfig?: SecurityConfigObj;
    }
    interface SecurityConfigObj extends Option_2 {
        domainSettings: DomainSettingsObj;
    }
    interface DomainSettingsObj extends Option_2 {
        cleartextPermitted: boolean;
        domains: DomainObj[];
    }
    interface DomainObj extends Named {
        subdomains?: boolean;
    }
    interface ModuleObj extends RequiredNamed {
        package: string;
        description?: string;
        supportedModes?: string[];
        theme?: string;
        entryTheme?: string;
        reqCapabilities?: string[];
        deviceType: string[];
        distro: DistroObj;
        metaData?: MetaDataObj;
        abilities?: AbilitiesObj[];
        commonEvents?: CommonEventObj[];
        shortcuts?: ShortcutsObj[];
        js?: JsObj[];
        reqPermissions?: ReqPermissionsObj[];
        defPermissions?: DefPermissionsObj[];
        definePermissions?: DefPermissionsObj[];
        defPermissionGroups?: DefPermissionGroupsObj[];
        allowClassMap?: boolean;
        mainAbility?: string;
        resizeable?: boolean;
        colorMode?: string;
        testRunner?: TestRunnerObj;
        distroFilter?: ModuleBuildProfile.DistroFilterBuildOpt;
    }
    interface TestRunnerObj extends RequiredNamed {
        srcPath: string;
    }
    interface DistroObj extends Option_2 {
        deliveryWithInstall: boolean;
        moduleName: string;
        moduleType: string;
        installationFree?: boolean;
    }
    interface MetaDataObj extends Option_2 {
        parameters?: ParametersObj[];
        results?: ResultObj[];
        customizeData?: CustomizeDataObj[];
        mergeRule?: MergeRuleObj;
    }
    interface ParametersObj extends Named {
        type: string;
        description?: string;
        mergeRule?: MergeRuleObj;
    }
    interface ResultObj extends Named {
        type: string;
        description?: string;
        mergeRule?: MergeRuleObj;
    }
    interface CustomizeDataObj extends Named {
        value?: string;
        extra?: string;
        mergeRule?: MergeRuleObj;
    }
    interface AbilitiesObj extends RequiredNamed {
        description?: string;
        icon?: string;
        label?: string;
        skills?: SkillsObj[];
        orientation?: string;
        visible?: boolean;
        srcPath: string;
        srcLanguage?: string;
        formsEnabled?: boolean;
        type: string;
        launchType?: string;
        theme?: string;
        uri?: string;
        metaData?: MetaDataObj;
        permissions?: string[];
        configChanges?: string[];
        process?: string;
        backgroundModes?: string[];
        grantPermission?: boolean;
        definePermissions?: DefinePermissionsObj;
        formEnabled?: boolean;
        form?: FormObj;
        readPermission?: string;
        writePermission?: string;
        uriPermission?: UriPermissionObj;
        multiUserShared?: boolean;
        mission?: string;
        targetAbility?: string;
        supportPipMode?: boolean;
        mergeRule?: MergeRuleObj;
        forms?: FormsObj[];
        resizeable?: boolean;
        deviceCapability?: string[];
        entryTheme?: string;
    }
    interface SkillsObj extends Option_2 {
        actions?: string[];
        entities?: string[];
        uris?: UrisObj[];
    }
    interface UrisObj extends Option_2 {
        scheme?: string;
        host?: string;
        port?: string;
        path?: string;
        pathStartWith?: string;
        pathRegx?: string;
        type?: string;
        uri?: string;
    }
    interface FormObj extends Option_2 {
        formEntity: string[];
        minHeight: number;
        defaultHeight: number;
        minWidth: number;
        defaultWidth: number;
    }
    interface FormsObj extends RequiredNamed {
        description?: string;
        type?: string;
        jsComponentName?: string;
        colorMode?: string;
        isDefault?: string;
        updateEnabled?: boolean;
        scheduledUpdateTime?: number;
        updateDuration?: number;
        supportDimensions?: string[];
        defaultDimension?: string;
        landscapeLayouts?: string[];
        portraitLayouts?: string[];
        deepLink?: string;
        metaData?: MetaDataObj[];
        formConfigAbility?: string;
        formVisibleNotify?: boolean;
    }
    interface UriPermissionObj extends Option_2 {
        mode?: string;
        path: string;
    }
    interface CommonEventObj extends Named {
        permission?: string;
        data?: string[];
        type?: string[];
        events: string[];
        mergeRule?: MergeRuleObj;
    }
    interface ShortcutsObj extends Option_2 {
        shortcutId?: string;
        label?: string;
        icon?: string;
        intents?: IntentObj[];
    }
    interface IntentObj extends Option_2 {
        targetClass?: string;
        targetBundle?: string;
    }
    interface JsObj extends RequiredNamed {
        pages: string[];
        window?: WindowObj;
        mergeRule?: MergeRuleObj;
        type?: string;
        mode?: ModeObj;
    }
    interface WindowObj extends Option_2 {
        designWidth?: number;
        autoDesignWidth?: boolean;
    }
    interface ModeObj extends Option_2 {
        syntax?: string;
        type?: string;
    }
    interface ReqPermissionsObj extends RequiredNamed {
        reason?: string;
        usedScene?: UsedSceneObj;
        mergeRule?: MergeRuleObj;
    }
    interface UsedSceneObj extends Option_2 {
        ability?: string[];
        when?: string;
    }
    interface DefPermissionsObj extends Named {
        grantMode?: string;
        label?: string;
        description?: string;
        group?: string;
        availableScope?: string[];
        mergeRule?: MergeRuleObj;
    }
    interface DefinePermissionsObj extends Named {
        grantMode?: string;
        label?: string;
        description?: string;
        availableLevel?: string;
        provisionEnable?: boolean;
        distributedSceneEnable?: boolean;
    }
    interface DefPermissionGroupsObj extends Named {
        icon?: string;
        label?: string;
        description?: string;
        order?: number;
        request?: string;
        mergeRule?: MergeRuleObj;
    }
    interface MergeRuleObj extends Option_2 {
        remove?: string[];
        replace?: string[];
    }
    interface ConfigOptObj extends Option_2 {
        app: AppObj;
        deviceConfig: DeviceConfigObj;
        module: ModuleObj;
    }
}

declare interface Configurable extends Option_2 {
    runtimeOS?: string;
}

/**
 * 定义的入参是一个参数的方法接口
 */
declare interface Consumer<T> {
    (arg: T): Promise<void> | void;
}

declare interface CopyCodeResource extends Option_2 {
    enable?: boolean;
    excludes?: string[];
    includes?: string[];
}

/**
 * hvigor 工程的module模块的数据管理对象
 *
 * @since 2022/2/23
 */
declare abstract class CoreModuleModelImpl implements ModuleModel {
    private readonly module;
    private readonly name;
    private readonly parentProject;
    private readonly buildProfilePath;
    private moduleBuildOpt;
    private belongProjectPath;
    private compilePluginPath;
    protected readonly _sourceRootDir: string;
    protected readonly modulePath: string;
    protected targetSourceSetMap: Map<string, SourceSetModelType>;
    protected targets: ModuleBuildProfile.ModuleTargetBuildOpt[];
    protected constructor(module: Module, parentProject: ProjectModel);
    /**
     * 初始化belongProjectPath
     *
     * @param modulePath 模块路径
     */
    initBelongProjectPath(modulePath: string): string;
    findBelongProjectPath(currentDirPath: string): string;
    getBelongProjectPath(): string;
    getCompilePluginPath(): string | undefined;
    setCompilePluginPath(path: string): void;
    refreshData(): void;
    trace(): void;
    isOhpmProject(): boolean;
    abstract isAtomicService(): boolean;
    abstract isFormWidgetModule(targetName: string): boolean;
    abstract isFormExtensionModule(targetName: string): boolean;
    abstract isInstallFree(): boolean;
    abstract getDeviceTypes(): string[];
    abstract getPermission(): object;
    abstract hasFormConfig(targetName: string): boolean;
    isMixedDeviceModule(): boolean;
    isPurerRichDeviceModule(): boolean;
    haveRichDevicesInModule(): boolean;
    haveLiteDevicesInModule(): boolean;
    isPurerLiteDeviceModule(): boolean;
    isSingleDeviceTypeModule(): boolean;
    abstract getJsonObjByTargetName(targetName: string): ConfigJson.ConfigOptObj | ModuleJson.ModuleOptObj;
    abstract initDefaultTargetSourceSet(): void;
    abstract getModuleType(): ModuleType;
    abstract getSourceSetByTargetName(targetName: string): SourceSetModel;
    abstract getJsonPathByTargetName(targetName: string): string;
    getRelatedEntryModules(): string[] | undefined;
    getSourceRootByTargetName(targetName?: string): string;
    getBuildProfileName(): string;
    getName(): string;
    getProjectDir(): string;
    getParentProject(): ProjectModel;
    getPackageJsonPath(): string;
    /**
     * 返回模块下的oh-package.json5路径 || .hvigor/dependencyMap下的oh-package.json5路径
     * @returns {string}
     */
    getOhPackageJson5Path(): string;
    getProfilePath(): string;
    getProfileOpt(): ModuleBuildProfile.ModuleBuildOpt;
    isArkModule(): boolean;
    /**
     * 根据模块的运行时配置文件module.json5/config.json来获取取模块的类型信息
     *
     * @returns {boolean} true/false
     */
    isHapModule(): boolean;
    isHarModule(): boolean;
    isHspModule(): boolean;
    getProductApiMeta(product: string): ProjectBuildProfile.ProductApiMeta | undefined;
    getCompileApiMetaByProduct(product: string): ProjectBuildProfile.ApiMeta;
    getCompatibleApiMetaByProduct(product: string): ProjectBuildProfile.ApiMeta;
    /**
     * 返回compatibleSdkVersion原始值(用户配置的值)
     *
     * @param product
     * @returns {string}
     */
    getOriginCompatibleSdkVersionByProduct(product: string): string | number | undefined;
    getTargetApiMetaByProduct(product: string): ProjectBuildProfile.ApiMeta | undefined;
    getAllModules(): ModuleModel[];
    getApiType(): ApiType;
    /**
     * 模块的compileMode根据工程的属性进行判断
     *
     * @returns {CompileModeEnum} jsBundle | esModule
     */
    getCompileMode(product: ProjectBuildProfile.ProductBuildOpt): CompileModeEnum;
    getTargetOptions(): ModuleBuildProfile.ModuleTargetBuildOpt[];
    /**
     * 获取对应module的targets集合，如果没有配置，则默认为
     * [
     *  {
     *    name: 'default'
     *  }
     * ]
     *
     * @return {ModuleBuildProfile.ModuleTargetBuildOpt[]}
     */
    private getOrDefaultTargets;
    moduleBuildProfileCheck(isHapModule: boolean): void;
    private checkModuleBuildProfile;
    private validateCompileMode;
    getModule(): Module;
    processTargetsConfig(): void;
    /**
     * 返回当前模块的绝对路径化的worker路径，校验移至prebuild完成
     *
     * @param {BuildOpt | undefined} buildOption
     * @returns {string[] | undefined}
     */
    getWorkerConfig(buildOption: BuildOpt | undefined): string[] | undefined;
    getAllTargetSourceSet(): ReadonlyMap<string, SourceSetModelType>;
    getJsonProfilePath(targetName: string, isFaMode?: boolean): string;
    getJsonProfileOptByTargetName(targetName: string, isFaMode?: boolean): ConfigJson.ConfigOptObj | ModuleJson.ModuleOptObj;
    /**
     * 通过模型获取jsonProfile
     *
     * @param service moduleTaskService
     * @param targetName targetName
     * @private
     */
    getJsonProfileByModel(service: ModuleTaskService, targetName: string): JsonProfile;
    isCrossplatformModule(arkUIXConfigObj: ArkUIXConfigJson.ConfigObj | undefined): boolean;
    isIgnoreCrossPlatformCheckModule(arkUIXConfigObj: ArkUIXConfigJson.ConfigObj | undefined): boolean;
    /**
     * 获取远程仓hsp路径
     */
    getRemoteHspPath(): string;
    getMockConfigPath(): string;
    isOutModule(): boolean;
}

/**
 * Hvigor可执行任务的Task的基础抽象类
 *
 * @since 2022/1/20
 */
declare abstract class CoreTask {
    /**
     * 获取Task的可执行function，即Task的实际任务逻辑，是通过该function来执行的
     *
     * @return {Function} Js中的可执行function
     */
    abstract getAction(): Function;
    /**
     * 获取任务名
     *
     * @return {string} task name
     */
    abstract getName(): string;
    /**
     * 获取任务的完整路径,路径为包括该任务所属的Node.eg:NodeName:TaskName
     *
     * @return {string} task path
     */
    abstract getPath(): string;
    /**
     * 获取当前任务所属的hvigorNode对象
     *
     * @return {HvigorCoreNode}
     */
    abstract getNode(): HvigorCoreNode;
    /**
     * 获取当前任务的所有依赖Task的任务名列表
     *
     * @return {string[]} 依赖的任务名列表
     */
    abstract getDependsOn(): string[];
    /**
     * 通过任务名给当前Task设置1...n个依赖Task,并建立任务之间的依赖管理,保存到DAG图中
     * 依赖的任务名必须是在当前module中存在的
     * 区别于{addDependsOn}任务,该任务是以覆盖的方式设置任务依赖
     *
     * @param {string[]} taskNames
     * @return {CoreTask}
     */
    abstract setDependsOn(...taskNames: string[]): CoreTask;
    /**
     * 通过任务名给当前Task添加一个依赖Task,并建立任务之间的依赖,保存到DAG图中
     * 依赖的任务名必须是在当前module中存在的
     * 区别于{setDependsOn}任务,该任务是在原有的基础上增加一个Task依赖
     *
     * @param {string} taskName
     * @return {CoreTask}
     */
    abstract addDependsOn(taskName: string): CoreTask;
    /**
     * 通过任务名或者Task对象直接给当前任务添加依赖，并保存到DAG图中
     * 依赖的任务默认是当前的module
     *
     * @param {string | CoreTask} task
     * @return {CoreTask}
     */
    abstract dependsOn(task: string | CoreTask): CoreTask;
    /**
     * 通过任务名或者Task对象直接给当前任务添加依赖，并保存到DAG图中
     * 依赖的任务可以根据nodeName指定其他Node
     *
     * @param {string | CoreTask} taskName
     * @param {string | HvigorCoreNode} nodeName hvigor Node的名称,保持跟根项目的build-profile.json5中的一致
     * @return {CoreTask}
     */
    abstract dependsOn(taskName: string | CoreTask, nodeName?: string | HvigorCoreNode): CoreTask;
    /**
     * 设置Task的enabled的状态
     *
     * @param {boolean} enabled 是否使用该task
     */
    abstract setEnabled(enabled: boolean): CoreTask;
    /**
     * 获取Task的enabled的状态
     *
     * @return {boolean} true/false
     */
    abstract getEnabled(): boolean;
    /**
     * 标记某些Task不需要跟踪任务执行状态，即不需要检测增量等
     *
     * @param {string} reason 不需要跟踪的原因
     */
    abstract doNotTrackState(reason: string): void;
    /**
     * 设置任务的group分组
     *
     * @param {string} group 任务分组
     */
    abstract setGroup(group: string): CoreTask;
    /**
     * 获取任务的group分组
     *
     * @return {string}
     */
    abstract getGroup(): string;
    /**
     * 设置任务的描述信息
     *
     * @param {string} description 任务描述
     */
    abstract setDescription(description: string): CoreTask;
    /**
     * 获取任务的描述信息
     *
     * @return {string}
     */
    abstract getDescription(): string | undefined;
    /**
     * 任务执行失败之后后的回调
     *
     * @param error
     */
    abstract onFailed(error: Error): void;
    abstract getHvigorTask(): Task | undefined;
    abstract beforeRun(fn: Function): void;
    abstract afterRun(fn: Function): void;
}

/**
 * hvigor task的核心类，包含了基础的成员变量和默认的方法实现
 *
 * @since 2022/4/22
 */
declare class CoreTaskImpl extends CoreTask {
    protected taskLog: HvigorLogger;
    protected node: HvigorCoreNode;
    protected name: string;
    protected path: string;
    protected dependsTask: string[];
    protected fn: Function;
    protected isEnabled: boolean;
    protected group: string;
    protected description: string;
    private subDurationEventMap;
    private readonly workerDelegator;
    private readonly afterRunFnQueue;
    private readonly beforeRunFnStack;
    taskExecutedStatus: TaskExecuteStatus;
    durationEvent: DurationEvent;
    pendingPromises: TaskPendingPromises;
    constructor(node: HvigorCoreNode, taskDetails: TaskDetails);
    getWorkerPool(): WorkerPoolDelegator;
    execute(): Promise<void>;
    taskShouldDo(): boolean;
    onFailed(error: Error): void;
    setDependsOn(...taskNames: string[]): CoreTask;
    getDependsOn(): string[];
    addDependsOn(taskName: string): CoreTask;
    dependsOn(task: string | CoreTask, node?: string | HvigorCoreNode): CoreTask;
    /**
     * 添加模块间任务依赖时，根据对应的模块名找对应依赖的模块,当前顺序为先模块后工程
     * 由于存在模块名和工程名一样的场景,因此增加一个默认':'时代表project
     *
     * @param {string} nodeName
     * @return {Module | Project}
     * @private
     */
    private findTargetNode;
    private isProject;
    getAction(): Function;
    getNode(): HvigorCoreNode;
    getName(): string;
    getPath(): string;
    getTaskLog(): HvigorLogger;
    getEnabled(): boolean;
    setEnabled(enabled: boolean): CoreTask;
    setDescription(description: string): CoreTask;
    getDescription(): string | undefined;
    getGroup(): string;
    setGroup(group: string): CoreTask;
    doNotTrackState(reason: string): void;
    /**
     * 添加任务子矩阵
     *
     * @param workId
     */
    addSubDurationEvent(workId: string): DurationEvent;
    /**
     * 获取任务子矩阵
     *
     * @param workId
     */
    getSubDurationEvent(workId: string): DurationEvent | undefined;
    /**
     * 根据hvigorNode以及task name来获取task的path
     *
     * @param {DefaultNodeImpl} hvigorNode
     * @param {string} taskName
     * @returns {string}
     */
    private static createTaskPath;
    /**
     * 获取当前task对外暴露的HvigorTask对象
     */
    getHvigorTask(): Task | undefined;
    beforeRun(fn: Function): void;
    afterRun(fn: Function): void;
    getAfterRunQueue(): Queue<Function>;
    getBeforeRunStack(): Stack<Function>;
    /**
     * 执行Task的前置hook方法栈
     */
    executeBeforeRun(): Promise<void>;
    /**
     * 执行Task的后置hook队列
     */
    executeAfterRun(): Promise<void>;
}

declare interface CustomizedOptions {
    basePackage?: string;
}

declare interface DebugSymbol extends Option_2 {
    strip?: boolean;
    exclude?: string[];
}

/**
 * module依赖的工程内的本地har模块
 *
 * @since 2022/5/7
 */
declare class DefaultModuleDependency extends DefaultNpmDependency {
    private readonly _module;
    constructor(dependencyBuilder: DependencyBuilder);
    getModuleName(): string;
    getModule(): HvigorCoreNode;
}

/**
 * module对应的所有的har依赖的包信息类
 *
 * @since 2022/5/7
 */
declare class DefaultNpmDependency implements Dependency {
    private readonly _dependencyName;
    private readonly _dependedVersion;
    private _lastDependencyName;
    private readonly _dependencyVersion;
    private readonly _dependencyRootPath;
    private readonly _dependencies;
    private readonly _pkgJsonPath;
    private readonly _pkgJsonName;
    private readonly _mainFilePath;
    private readonly _typesFilePath;
    private readonly _dependencyType;
    private readonly _dependencyEnum;
    private readonly _pkgJsonObj;
    private readonly _isLocal;
    private readonly _moduleJsonObj;
    private readonly _isModuleDependency;
    private readonly _mainFileRelativePath;
    private readonly _useNormalizedOHMUrl;
    constructor(dependencyBuilder: DependencyBuilder);
    getPackageJsonPath(): string;
    getPackageFilePath(): string;
    getPackageJsonObj(): PackageJson;
    getPackageName(): string;
    getDependencyName(): string;
    getDependedVersion(): string;
    getDependencyVersion(): string;
    getDependencyRootPath(): string;
    getDependencyMainFilePath(): string;
    getDependencyTypesFilePath(): string;
    getDependencyType(): DependencyType;
    getDependencyEnum(): DependencyEnum;
    getDependencies(): Partial<Record<string, string>>;
    getModuleJsonObj(): ModuleJson.ModuleOptObj | undefined;
    getDependencyMainFileRelativePath(): string | undefined;
    getUseNormalizedOHMUrl(): boolean | undefined;
    hasNative(): boolean;
    isLocal(): boolean;
    isByteCodeHarDependency(): boolean;
    isHarDependency(): boolean;
    isHspDependency(): boolean;
    isOtherDependency(): boolean;
    isSODependency(): boolean;
    /**
     * bundle Har的前提必须是一个字节码har
     */
    isBundleDependency(): boolean;
    getLastDependencyName(): string | undefined;
    setLastDependencyName(dependencyName: string): void;
    getMainFileRelativePath(_dependencyRootPath: string, _pkgJsonObj: OhPackageJsonOpt): string;
    getDefaultLibsDir(): string;
    isModuleDependency(): boolean;
    getDependencySrcMainPath(): string;
    getInsightIntentPathByResourceDir(resourceDir: string): string;
}

/**
 * Hvigor同步类型任务的基础类,同步类型的任务是用来在插件嵌入到其他平台中提供数据同步作用的
 * 为了跟执行构建任务区分，独立出来，单独扩展和使用，同时可以提高执行构建任务的效率，免去不必要的数据同步
 *
 * @since 2022/1/20
 */
declare abstract class DefaultSyncTask extends DefaultTask {
    protected constructor(defaultModule: HvigorCoreNode, taskName: string);
}

/**
 * Hvigor自定义任务的基础抽象类
 *
 * @since 2022/4/24
 */
declare abstract class DefaultTask extends CoreTaskImpl implements Registry {
    /**
     * 任何自定义的任务类都需要实现此构造方法，分别为指定模块的Node,以及对应的taskInfo
     * taskInfo可以只指定一个taskName，其他为默认值,或者为一个TaskDetails的对象
     *
     * @param {HvigorCoreNode} node
     * @param {string | TaskDetails} taskInfo
     * @protected
     */
    protected constructor(node: HvigorCoreNode, taskInfo: string | TaskDetails);
    /**
     * 注册task function
     *
     * @return {Function} 任务需要执行的逻辑
     */
    registryAction(): Function;
    /**
     * 获取task的执行逻辑函数
     *
     * @return {Function} 任务需要执行的逻辑
     */
    getAction(): Function;
}

/**
 * har依赖的接口类
 *
 * @since 2022/5/7
 */
declare interface Dependency {
    /**
     * 获取package.json的路径
     *
     * @returns {string}
     * @deprecated use getPackageFilePath().
     */
    getPackageJsonPath(): string;
    /**
     * 获取类package.json、起包定义作用的文件的路径
     *
     * @returns {string}
     */
    getPackageFilePath(): string;
    /**
     * 获取package.json的内容
     *
     * @returns PackageJson
     */
    getPackageJsonObj(): PackageJson;
    /**
     * module的package.json中的name
     *
     * @returns {string}
     */
    getPackageName(): string;
    /**
     * 获取package.json中声明的依赖名,对于npm依赖来说一般跟package.json中的name一致
     *
     * @returns {string}
     */
    getDependencyName(): string;
    /**
     * 获取该依赖在被依赖时配置的依赖版本号或路径
     *
     * @returns {string}
     */
    getDependedVersion(): string;
    /**
     * 获取package.json中声明的版本号
     *
     * @returns {string}
     */
    getDependencyVersion(): string;
    /**
     * 获取package.json中声明的dependencies
     *
     * @returns {Partial<Record<string, string>>}
     */
    getDependencies(): Partial<Record<string, string>>;
    /**
     * 获取依赖在当前module的node_modules中的路径, 对于本地module依赖, 则对应module路径
     *
     * @returns {string}
     */
    getDependencyRootPath(): string;
    /**
     * 获取package.json中main对应文件的路径, 若没配main则默认为index.js
     * see: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#main
     *
     * @returns {string}
     */
    getDependencyMainFilePath(): string;
    getDependencyTypesFilePath(): string;
    getDependencyType(): DependencyType;
    getDependencyEnum(): DependencyEnum;
    getModuleJsonObj(): ModuleJson.ModuleOptObj | undefined;
    getDependencyMainFileRelativePath(): string | undefined;
    getUseNormalizedOHMUrl(): boolean | undefined;
    hasNative(): boolean;
    isLocal(): boolean;
    getLastDependencyName(): string | undefined;
    setLastDependencyName(dependencyName: string): void;
    getDefaultLibsDir(): string;
    isByteCodeHarDependency(): boolean;
    isBundleDependency(): boolean;
    isHarDependency(): boolean;
    isHspDependency(): boolean;
    isOtherDependency(): boolean;
    getDependencySrcMainPath(): string;
    getInsightIntentPathByResourceDir(resourceDir: string): string;
    isSODependency(): boolean;
    /**
     * 判断该依赖是在模块级还是工程级的oh-packages里面配置的
     */
    isModuleDependency(): boolean;
}

declare class DependencyBuilder {
    private _module;
    private _dependencyName;
    private _dependedVersion;
    private _lastDependencyName;
    private _dependencyVersion;
    private _dependencyRootPath;
    private _dependencies;
    private _pkgJsonPath;
    private _pkgJsonObj;
    private _dependencyType;
    private _dependencyEnum;
    private _isLocal;
    private _moduleJsonObj;
    private _isModuleDependency;
    setIsModuleDependency(value: boolean): this;
    isModuleDependency(): boolean;
    buildDefaultNpmDependency(): DefaultNpmDependency;
    buildDefaultModuleDependency(): DefaultModuleDependency;
    setModule(module: Module): this;
    setDependencyName(dependencyName: string): this;
    setDependedVersion(dependedVersion: string): this;
    setDependencyRootPath(dependencyRootPath: string): this;
    setPkgJsonPath(pkgJsonPath: string): this;
    setPkgJsonObj(pkgJsonObj: PackageJson): this;
    setDependencyType(dependencyType: DependencyType): this;
    setDependencyEnum(dependencyEnum: DependencyEnum): this;
    setIsLocal(isLocal: boolean): this;
    setModuleJsonObj(moduleJsonObj?: ModuleJson.ModuleOptObj): this;
    setLastDependencyName(lastDependencyName: string): this;
    getModule(): Module;
    getDependencyName(): string;
    getDependedVersion(): string;
    getDependencyVersion(): string;
    getDependencyRootPath(): string;
    getPkgJsonPath(): string;
    getPkgJsonObj(): PackageJson;
    getDependencies(): Partial<Record<string, string>>;
    getDependencyType(): DependencyType;
    getDependencyEnum(): DependencyEnum;
    getLastDependencyName(): string | undefined;
    isLocal(): boolean;
    getModuleJsonObj(): ModuleJson.ModuleOptObj | undefined;
}

declare enum DependencyCacheKey {
    AllHspDependencies = 0,
    RootByteCodeHarDependencies = 1,
    RootOtherDependencies = 2,
    RootHspDependencies = 3,
    AffectsCompilationDependencies = 4,
    AllByteCodeHarDependencies = 5,
    AllModuleDependencies = 6
}

declare interface DependencyCacheValue {
    dependencies: Dependency[];
    moduleDepMap: Map<string, Dependency>;
}

declare type DependencyCollector = (node: ModulePkgNode) => boolean;

declare enum DependencyEnum {
    DEPENDENCIES = 'dependencies',
    DYNAMIC_DEPENDENCIES = 'dynamicDependencies',
    DEV_DEPENDENCIES = 'devDependencies'
}

declare type DependencyFilter = (node: ModulePkgNode, pre: boolean, post: boolean) => boolean;

/**
 * 管理har的依赖，提供获取当前模块依赖的数据信息
 *
 * @since 2022/5/7
 */
declare class DependencyManager {
    private _allDependency;
    private readonly _model;
    private readonly _projectModel;
    private readonly _moduleName;
    private readonly _isFaMode;
    private readonly _isOhpmDependency;
    private legacyDependencyManagerHelper;
    constructor(isFaMode: boolean, model: ModuleModel | ProjectModel, project?: ProjectModel);
    private isOhpmDependency;
    createModelDependencyInfo(): ModuleDependencyInfo;
    collectModelOrProjectAllDependencyInfo(): Dependency[];
    /**
     * 构造本地模块为Dependency对象
     *
     * @param model
     * @param modulePkgPath
     */
    buildSelfDependency(model: ProjectModel | ModuleModel, modulePkgPath: string): DefaultModuleDependency;
    collectAllDependencies(): {
        npmDependencies: Dependency[];
        moduleDependencyMap: Map<string, Dependency>;
        modulePkgNode: ModulePkgNode;
        projectPkgNode: ModulePkgNode | undefined;
    };
    collectAllDependenciesForPkgInfo(): {
        npmDependencies: Dependency[];
        moduleDependencyMap: Map<string, Dependency>;
        modulePkgNode: ModulePkgNode;
        projectPkgNode: ModulePkgNode | undefined;
    };
    getDependenciesByFilter(model: ProjectModel | ModuleModel, pkgPath: string, filter?: DependencyFilter, projectFilter?: DependencyFilter): {
        npmDependencies: Dependency[];
        moduleDependencyMap: Map<string, Dependency>;
        modulePkgNode: ModulePkgNode;
        projectPkgNode: ModulePkgNode | undefined;
    };
    private getDependenciesForPkgInfo;
    private collectModuleHarDependencyForHap;
    collectAllHspDependencies(): [string, Dependency][];
    private collectProjectHarDependencyForHap;
    /**
     *
     * @param modulePkgObj
     * @private
     */
    private collectHarDependency;
    private resolveDeps;
    private collectFromTree;
    /**
     * 广度优先从依赖树中遍历收集依赖
     * 写过滤器时注意前后区别
     *
     * @param params
     *   root 依赖树
     *   npmDeps npm依赖数组
     *   moduleDepMap 本地模块依赖map
     *   filter 过滤器
     *   shouldCollect 是否收集进npmDeps和moduleDepMap
     *
     */
    collectDependenciesFromTree(params: {
        root: ModulePkgNode;
        npmDeps: Dependency[];
        moduleDepMap: Map<string, Dependency>;
        filter?: DependencyFilter;
        shouldCollect?: DependencyCollector;
    }): void;
    private collectDependency;
    private getDependencyType;
    private getPkgFileName;
    private getModuleJsonObj;
    /**
     * 通过config.json/module.json5判断当前模块是否为鸿蒙依赖（har/hsp）
     *
     * @param {string} pkgPath 当前模块的路径
     * @returns {boolean}
     * @private
     */
    private getDependencyTypeByProfile;
    /**
     * 获取当前模块的moduleType
     *
     * @param {string} runtimeJson config.json/module.json5
     * @returns {boolean}
     * @private
     */
    private getDependencyTypeByProfileType;
    /**
     * 通过config.json/module.json5判断当前模块是否支持stage
     *
     * @param {string} pkgPath 当前模块的路径
     * @returns {boolean}
     * @private
     */
    private checkHspOrHarStatusByProfile;
    /**
     * 检查当前模块的model与hap是否一致
     * @param runtimeJson
     * @param depModuleIsFAMode 依赖模块是否为FA专用
     * @private
     */
    private checkHspOrHarStatus;
    /**
     * 1. 根据config.json/module.json5判断是不是鸿蒙依赖（har/hsp）
     * 2. 根据包管理的关键特征判断是否是har报
     * 3. 考虑循环依赖，用set过滤重复项，向queue中添加package.json路径
     *
     * @param {string} pkgJsonPath 当前模块依赖的npm的package.json/oh-package.json5路径
     * @param {OhosPackageJson} devPkgJsonObj 当前模块依赖的package.json对象
     * @param curPkgJsonPath
     * @param pkgName
     * @returns {boolean}
     * @private
     */
    private getHarmonyDependencyType;
    /**
     * npm和ohpm的不同包管理机制下,判断一个依赖是否为har包
     * 1.ohpm只需要判断依赖中是否包含oh-package.json5
     * 2.npm需要判断package.json5中是否包含ohos字段
     *
     * @param {string} pkgPath
     * @param {OhosPackageJson} devPkgJsonPathObj
     * @returns {boolean}
     * @private
     */
    private isHarForDiffPackManagement;
    /**
     * 针对hap依赖不同har的一些业务规则校验
     * 1.FA模型不支持依赖闭源har(stage模型+esModule编译)
     *
     * @param {string} pkgPath
     * @param {OhosPackageJson} devPkgJsonPathObj
     * @private
     */
    private checkHarStatusIsCompatibleForHap;
    /**
     * 通过入口文件路径地址判断当前依赖是否为本地依赖 暂时用于判断so类型依赖
     * 若包含oh_modules字段则为远程依赖
     * @param path 依赖入口文件路径地址
     */
    static isLocalDependencyForSo(path: string): boolean;
    /**
     * 判断指定依赖是否为本地依赖
     * @param dependency
     * @param moduleModelNodePaths
     */
    static isLocalDependency(dependency: Dependency, moduleModelNodePaths: Set<string>): boolean;
    /**
     * 通过oh-package.json5获取moduleName
     * @param dependencyRootPath
     * @private
     */
    static getModuleNameFromOhPkgJson(dependencyRootPath: string): string;
    /**
     * 获取远程依赖routerMap配置集合
     * @param remoteDependency
     * @private
     */
    static getRemoteDependencyRouterMapObjList(remoteDependency: Dependency): any[] | undefined;
    /**
     * 获取本地依赖routerMap配置集合
     * @param localDependency
     * @param projectModel
     * @param targetName
     */
    static getLocalDependencyRouterMapObjList(localDependency: Dependency | undefined, projectModel: ProjectModel, targetName?: string): any[] | undefined;
    /**
     * 获取依赖模块的routerMap配置路径
     * @private
     * @param dependencyModuleModel
     * @param targetName
     */
    static getDependencyModuleRouterMapJsonPath(dependencyModuleModel: ModuleModel | undefined, targetName?: string): string | undefined;
    /**
     * 获取模块配置的路由表文件名
     * @param moduleModel
     */
    static getRouterMapJsonFileName(moduleModel: ModuleModel | undefined): string | undefined;
    /**
     * 获取远程依赖har（产物态）的shareConfig配置文件路径（适配多target场景）
     * @param remoteDependency
     * @param shareConfigFileName
     * @private
     */
    static getRemoteDependencyShareConfigJsonPath(remoteDependency: Dependency, shareConfigFileName: string): string | undefined;
    /**
     * 获取远程依赖shareConfig配置集合
     * @param remoteDependency
     * @private
     */
    static getRemoteDependencyShareConfigObjList(remoteDependency: Dependency): any[] | undefined;
    /**
     * 获取本地依赖shareConfig配置集合
     * @param localDependency
     * @param projectModel
     * @param targetName
     */
    static getLocalDependencyShareConfigObjList(localDependency: Dependency | undefined, projectModel: ProjectModel, targetName?: string): any[] | undefined;
    /**
     * 获取本地依赖模块的shareConfig配置路径
     * @private
     * @param dependencyModuleModel
     * @param targetName
     */
    static getDependencyModuleShareConfigJsonPath(dependencyModuleModel: ModuleModel | undefined, targetName?: string): string | undefined;
    /**
     * 获取模块配置的共享配置文件名
     * @param moduleModel
     */
    static getShareConfigJsonFileName(moduleModel: ModuleModel | undefined): string | undefined;
    /**
     * 通过本地依赖获取对应moduleModel
     * @param dependency
     * @param projectModel
     */
    static getModuleModelByDependency(dependency: Dependency, projectModel: ProjectModel): ModuleModel | undefined;
    /**
     * 获取远程依赖module.json对象
     *
     * @param remoteDependency
     * @private
     */
    static getModuleObjByRemoteDependency(remoteDependency: Dependency): ModuleJson.ModuleOptObj;
    private getSODependencyType;
    /**
     * 判断是否为间接依赖的devDependencies
     *
     * @param modulePkgJsonPath  父节点的oh_package.json5路径
     * @param dependencyEnum  当前节点的类型
     */
    private isIndirectDevdependency;
    /**
     * 获取最终的ohPkgJson的对象ohPkgJsonObj
     * 判断是否需要用overrideDependencyMap来替换ohPkgJsonObj的依赖值
     *
     * @param modulePath
     * @private
     */
    private getFinalOhPkgJsonObj;
}

declare enum DependencyType {
    DEPENDENCY_TYPE_HAR = 'har',
    DEPENDENCY_TYPE_HSP = 'hsp',
    DEPENDENCY_TYPE_SO = 'so',
    DEPENDENCY_TYPE_OTHER = 'other',
    DEPENDENCY_TYPE_HAP = 'hap'
}

declare interface DependRemoteHspInfo extends OhpmDependencyInfo {
    soPath?: string;
}

declare class DurationEvent extends BaseEvent {
    additional: DurationEventAdditional;
    log: HvigorLogger;
    constructor(id: string, name: string, description: string, pid: number, group: string, tid: string);
    start(state?: DurationEventState, time?: number): this;
    stop(state?: DurationEventState, time?: number): this;
    setState(state: DurationEventState): void;
    createSubEvent(name: string, description: string): DurationEvent;
    addChild(childId: string): void;
    setParent(parentId: string): void;
    getParent(): string | undefined;
    getChildren(): string[];
    setLog(name?: string, type?: MetricLogType, description?: string, totalTime?: number): void;
    setParentLog(logEvent: LogEvent): void;
    setChildrenLog(logEvent: LogEvent): void;
    setDetail(name: string): void;
    setCategory(category: string): void;
    addTaskRunReason(taskRunReason: string): void;
}

declare class DurationEventAdditional implements EventAdditional {
    category?: string;
    parent?: string;
    children: string[];
    state: DurationEventState;
    logId?: string;
    detailId?: string;
    targetName: string;
    moduleName: string;
    taskRunReasons: string[];
    constructor(eventName: string, category: string);
}

declare enum DurationEventState {
    CREATED = 'created',
    BEGINNING = 'beginning',
    RUNNING = 'running',
    FAILED = 'failed',
    SUCCESS = 'success',
    WARN = 'warn'
}

declare type EventAdditional = object;

declare class EventBody {
    pid: number;
    tid: string;
    startTime: number;
    endTime?: number;
    totalTime?: number;
    constructor(pid: number, tid: string);
}

declare class EventHead {
    id: string;
    name: string;
    description: string;
    type: MetricEventType;
    constructor(id: string, name: string, description: string, type: MetricEventType);
}

declare interface ExpandImportPath {
    enable: boolean;
    exclude?: string[];
}

declare interface ExternalNativeOpt extends Option_2 {
    path?: string;
    arguments?: string | string[];
    abiFilters?: string[];
    cppFlags?: string;
    cFlags?: string;
    targets?: string[];
}

declare type ExternalNativeOptions = {
    path?: string;
    arguments?: string;
    abiFilters?: string[];
    cppFlags?: string;
    cFlags?: string;
    targets?: string[];
};

declare class FileLogger {
    debug(message: any, ...args: any[]): any[];
    warn(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
}

/**
 * Copyright (c) Huawei Technologies Co., Ltd. 2022-2022. All rights reserved.
 */
declare class FileSet {
    private _group;
    addEntry(path: string, options?: FsOptions): this;
    deleteEntry(path: string): this;
    addEntries(entries: string[], options?: FsOptions): this;
    collect(): Map<string, FsOptions>;
}

/**
 * 任务输入输出路径选项
 *
 * @since 2022/8/31
 */
declare interface FsOptions {
    isDirectory?: boolean;
    /**
     * 正则表达式字符串
     */
    test?: RegExp;
    /**
     * 文件夹深度
     */
    depth?: number;
    /**
     * 该文件对应的FileSnapShot快照的HashValue
     */
    fileSnapShotHashValue?: string;
}

declare interface HapModuleBuildOpt extends CommonModuleBuildOpt {
    debuggable?: boolean;
    sourceOption?: SourceOpt;
    compileMode?: CompileModeEnum;
    aotCompileMode?: AotCompileModeEnum;
    apPath?: string;
    generateSharedTgz?: boolean;
}

/**
 * Stage模型的hap插件
 *
 * @param module hvigorModule
 */
export declare const hapTasks: (module: Module) => AbstractHapModulePlugin;

declare interface HarModuleBuildOpt extends CommonModuleBuildOpt {
    artifactType?: string;
    packingOptions?: PackingOptions;
}

/**
 * Stage模型的Har插件
 *
 * @param module hvigorModule
 */
export declare const harTasks: (module: Module) => AbstractHarModulePlugin;

declare enum HookType {
    configEvaluated = 'configEvaluated',
    nodesInitialized = 'nodesInitialized',
    beforeNodeEvaluate = 'beforeNodeEvaluate',
    afterNodeEvaluate = 'afterNodeEvaluate',
    nodesEvaluated = 'nodesEvaluated',
    taskGraphResolved = 'taskGraphResolved',
    buildFinished = 'buildFinished',
    onWatchWorkerMessage = 'onWatchWorkerMessage'
}

/**
 * 对外暴露hap级别的接口和任务的plugin
 *
 * @since 2023/1/17
 */
export declare class HspPlugin extends AbstractModulePlugin {
    private assembleHsp;
    private buildPreviewerRes;
    private buildHotReloadRes;
    private previewBuild;
    private unitTestBuild;
    private hotReloadBuild;
    constructor(module: Module);
    initHspTasks(): void;
}

/**
 * Stage模型的hsp插件，注意没有Fa模型的hsp插件
 *
 * @param module hvigorModule
 */
export declare const hspTasks: (module: Module) => HspPlugin;

/**
 * hvigor的node模型,不论是project还是module都属于这种类型,其中提供了hvigor模块的公共接口
 * 并且继承了TaskManager中定义的模块用于管理任务的相关接口
 *
 * @since 2021/12/27
 */
declare interface HvigorCoreNode extends TaskManager, Class {
    /**
     * 获取Module名称
     *
     * @return {string} name
     */
    getName: () => string;
    /**
     * 获取Module的hvigorFile.js路径
     *
     * @return {string} hvigorFile.js path
     */
    getBuildFilePath: () => string;
    /**
     * 获取Module的build-profile.json5路径
     *
     * @return {string} build-profile.json5 path
     */
    getBuildProfilePath: () => string;
    /**
     * 获取模块路径
     *
     * @return {string} node path
     */
    getNodeDir: () => string;
    /**
     * 获取Module的packageJson
     *
     * @return {string} package.json path
     */
    getPackageJsonPath: () => string;
    /**
     * 通过名称获取Module
     *
     * @param {string} moduleName
     * @return {Module|undefined}
     */
    findModuleByName: (moduleName: string) => Module | undefined;
    /**
     * 注入plugin对象
     *
     * @param {HvigorSystemPlugin} plugin
     */
    bindPlugin: (plugin: HvigorSystemPlugin) => void;
    /**
     * 注入metaInfo上下文
     *
     * @param {string} pluginId 插件标识
     * @param {Function} func context Function
     */
    bindPluginContextFunc(pluginId: string, func: Function): void;
    /**
     * 获取plugin对象
     *
     * @param {string} pluginId
     * @return {HvigorSystemPlugin|undefined}
     */
    getPluginById: (pluginId: string) => HvigorSystemPlugin | undefined;
    /**
     * 根据pluginId获取MetaInfo信息
     *
     * @param {string} pluginId
     */
    getContext(pluginId: string): any;
    /**
     * 获取当前节点加载的所有pluginId
     *
     * @return {string[]}
     */
    getAllPluginIds(): string[];
    /**
     * 获取根项目project
     *
     * @return {Project}
     */
    getProject: () => Project;
    loadConfig(config: any): void;
    getConfigOpt: () => Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    executeNodeHook(hookTpye: HookType.beforeNodeEvaluate | HookType.afterNodeEvaluate): Promise<void>;
    afterBindSystemPlugins(fn: Consumer<HvigorNode>): void;
    executeAfterBindSystemPluginsHook(): Promise<void>;
}

/**
 * 基于log4js封装的HvigorLogger
 *
 * @since 2022/03/02
 */
declare class HvigorLogger {
    private static instanceMap;
    protected readonly anonymizeFileLogger: FileLogger;
    protected durationId: string | undefined;
    protected constructor(category?: string);
    /**
     * 获取对于类别的HvigorLogger实例
     *
     * @param {string} category 默认是default
     * @return {HvigorLogger}
     */
    static getLogger(category?: string): HvigorLogger;
    static getLoggerWithDurationId(category: string, durationId: string): HvigorLogger;
    static clean(): void;
    debug(message: unknown, ...args: unknown[]): void;
    info(message: unknown, ...args: unknown[]): void;
    warn(message: unknown, ...args: unknown[]): void;
    error(message: unknown, ...args: unknown[]): void;
    anonymizeDebug(message: unknown, ...args: unknown[]): void;
    _printTaskExecuteInfo(taskPath: string, time: string): void;
    _printFailedTaskInfo(taskPath: string): void;
    _printDisabledTaskInfo(taskPath: string): void;
    _printUpToDateTaskInfo(taskPath: string): void;
    _printStackErrorToFile(message: unknown, ...args: unknown[]): void;
    errorMessageExit(message: string, ...args: unknown[]): void;
    errorExit(e: Error, message?: string, ...args: unknown[]): void;
    createLogEventByDurationId(message: unknown, logType: MetricLogType, ...args: unknown[]): unknown;
    getMessage(message: string, ...args: unknown[]): string;
    /**
     * 三段式打印错误信息(不阻塞构建)
     * @param errorId 错误码表文件(如：hvigor.json)中的key
     * @param messages message格式化字符串
     * @param solutions solutions格式化字符串，二维数组，每一行对应solution中的一行
     */
    printError(errorId: string, messages?: unknown[], solutions?: unknown[][]): void;
    /**
     * 三段式打印错误信息(阻塞构建)
     * @param errorId 错误码表文件(如：hvigor.json)中的key
     * @param messages message格式化字符串
     * @param solutions solutions格式化字符串，二维数组，每一行对应solution中的一行
     * @param stack stack最终打印的堆栈
     */
    printErrorExit(errorId: string, messages?: unknown[], solutions?: unknown[][], stack?: string): void;
    /**
     * 在 hvigorfile.ts 中调用的函数如果使用 printErrorExit 报错退出会打印 throw 那一行的代码，而压缩后的代码只有一行，会把整个文件的代码都打印出来
     * 所以新增此方法避免打印多余信息影响阅读
     */
    printErrorExitWithoutStack(errorId: string, messages?: unknown[], solutions?: unknown[][]): void;
}

/**
 * Hvigor Plugin扩展接口定义
 */
declare interface HvigorNode {
    nodeDir: NormalizedFile;
    classKind: string;
    getNodeDir: () => NormalizedFile;
    /**
     * 向当前节点注册任务
     *
     * @param {HvigorPluginTask} task
     */
    registerTask: (task: HvigorTask) => void;
    /**
     * 根据任务名称获取任务
     *
     * @param {string} taskName 任务名
     * @return {HvigorTask | undefined}
     */
    getTaskByName: (taskName: string) => Task | undefined;
    /**
     * 获取当前节点名称
     *
     * @return {string}
     */
    getNodeName: () => string;
    /**
     * 获取当前节点路径
     *
     * @return {string}
     */
    getNodePath: () => string;
    /**
     * 获取父节点对象
     *
     * @return {HvigorNode | undefined}
     */
    getParentNode: () => HvigorNode | undefined;
    /**
     * 获取当前节点下所有字节点对象
     *
     * @return {HvigorNode | []}
     */
    subNodes: (callbackfn: (node: HvigorNode) => void) => void;
    /**
     * 根据节点名称查找子节点
     *
     * @param {string} nodeName 节点名称
     * @return {HvigorNode} hvigor节点对象
     */
    getSubNodeByName: (nodeName: string) => HvigorNode | undefined;
    /**
     * 根据pluginId获取插件提供的元数据
     *
     * @param {string} pluginId
     * @return {any} PluginContext
     */
    getContext: (pluginId: string) => any;
    /**
     * 获取当前节点加载的所有PluginId
     *
     * @return {string[]} pluginId集合
     */
    getAllPluginIds: () => string[];
    getConfigOpt: () => Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    getAllTasks(): Task[];
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    /** @internal */
    getNodeDirInternal: () => NormalizedFile;
    /** @internal */
    registerTaskInternal: (task: HvigorTask) => void;
    /** @internal */
    getTaskByNameInternal: (taskName: string) => Task | undefined;
    /** @internal */
    getNodeNameInternal: () => string;
    /** @internal */
    getNodePathInternal: () => string;
    /** @internal */
    getParentNodeInternal: () => HvigorNode | undefined;
    /** @internal */
    subNodesInternal: (callbackfn: (node: HvigorNode) => void) => void;
    /** @internal */
    getSubNodeByNameInternal: (nodeName: string) => HvigorNode | undefined;
    /** @internal */
    getContextInternal: (pluginId: string) => any;
    /** @internal */
    getAllPluginIdsInternal: () => string[];
    /** @internal */
    getConfigOptInternal: () => Config;
    /** @internal */
    addExtraOptionInternal: (key: string, value: any) => void;
    /** @internal */
    getExtraOptionInternal: (key: string) => any;
    /** @internal */
    getAllTasksInternal: () => Task[];
    /** @internal */
    beforeNodeEvaluateInternal: (fn: Consumer<HvigorNode>) => void;
    /** @internal */
    afterNodeEvaluateInternal: (fn: Consumer<HvigorNode>) => void;
}

/**
 * 对外暴露接口的plugin的基类
 *
 * @since 2021/12/16
 */
declare abstract class HvigorSystemPlugin {
    protected pluginVersion: string;
    protected readonly pluginId: string;
    protected constructor(pluginId: string);
    getPluginId(): string;
    abstract getContext(): any;
}

/**
 * HvigorTask声明
 */
declare interface HvigorTask {
    /**
     * 任务名称，全局唯一
     */
    name: string;
    /**
     * task 上下文
     */
    context?: (() => any) | any;
    /**
     * Task 定义增量输入接口
     *
     * @param input
     */
    input?: (input: TaskInput) => void;
    /**
     * task 定义增量输出接口
     *
     * @param output
     */
    output?: (output: TaskOutput) => void;
    /**
     * task beforeRun 在run方法之前执行
     *
     * @param taskContext
     */
    beforeRun?: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * 增量输入输出
     *
     * @param taskContext
     */
    afterRun?: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * Task执行逻辑，执行时调用此方法
     *
     * @param taskContext
     */
    run: (taskContext: HvigorTaskContext) => void | Promise<void>;
    /**
     * 当前Task依赖的Task列表
     * 前置依赖的tasks, 先执行前置依赖，再执行此task
     */
    dependencies?: (() => string[]) | string[];
    /**
     * 后置依赖的tasks, 执行后置依赖前，必须先执行此task
     */
    postDependencies?: (() => string[]) | string[];
}

/**
 * hvigorTask上下文信息
 */
declare interface HvigorTaskContext {
    /**
     * 当前编译的模块的名称
     */
    moduleName: string;
    /**
     * 当前编译的模块的路径
     */
    modulePath: string;
}

/**
 * 根据不同模型获取module.json5/config.json相关数据
 */
declare interface JsonProfile {
    jsonFilePath: string;
    profile: ModuleJson.ModuleOptObj | ConfigJson.ConfigOptObj;
    deviceTypes: string[];
    deviceConfig: string;
    configurationProfile: string;
}

declare interface LegacyAbilityModel {
    /**
     * 返回ability的名称
     */
    getName(): string;
    /**
     * 返回ability的输入/输出的目录名
     */
    getRelateSrcPath(): string;
    /**
     * 返回ability的类型
     */
    getType(): AbilityTypeEnum;
    /**
     * 返回ability使用的编译语言
     *
     * 只可CodeType.ets或者CodeType.js
     */
    getSrcLanguage(): CodeType;
    /**
     * 返回ability对应的js标签
     */
    getConfigJsonJsObj(): ConfigJson.JsObj | undefined;
}

/**
 * Fa模型的app插件
 *
 * @param module hvigorProject
 */
export declare const legacyAppTasks: (module: Project) => AppPlugin;

/**
 * Fa模型的hap插件
 *
 * @param module hvigorModule
 */
export declare const legacyHapTasks: (module: Module) => AbstractHapModulePlugin;

/**
 * Fa模型的Har插件
 *
 * @param module hvigorModule
 */
export declare const legacyHarTasks: (module: Module) => AbstractHarModulePlugin;

declare interface LegacyModuleTargetRes extends ResModel {
    /**
     * 获取target下config.json的对象
     */
    getConfigJsonOpt(): ConfigJson.ConfigOptObj;
    supportLiteDeviceModule(): boolean;
}

/**
 * 定义ohos-plugin老模型的任务使用的中间路径
 *
 * @since 2022/1/21
 */
declare interface LegacyPathInfo {
    /**
     * 构建过程中merge后的老config.json文件的目录
     *
     * @return string
     */
    getIntermediatesMergeLegacyProfile: () => string;
    /**
     * 构建处理老config.json后的中间目录
     *
     * @return string
     */
    getIntermediatesProcessLegacyProfile: () => string;
    /**
     * 获取js编译manifest.json的目录
     *
     * @return string
     */
    getIntermediatesLegacyManifestJson: () => string;
    /**
     * 获取瘦设备生成bin资源的目录
     *
     * @return string
     */
    getIntermediatesLiteBinSource: () => string;
    /**
     * 构建处理resources后生成ResourceTable.h的目录
     *
     * @return string
     */
    getGenerateSourceR: () => string;
    /**
     * 获取模块级别的pack.info父目录
     */
    getIntermediatesPackInfoDir: () => string;
    /**
     * 构建过程中c++代码编译输出路径 entry/.cxx
     *
     * @return string
     */
    getCppOutputDir: () => string;
    /**
     * 构建过程中c++代码编译输出目录
     *
     * @return ../build/intermediates/cmake/[target]/obj
     */
    getIntermediatesCppOutPut: () => string;
    /**
     * 生成的java代码目录
     *
     * @return {string} ../build/intermediates/java/[target]
     */
    getIntermediatesJavaDir: () => string;
    /**
     * 生成的shell java代码目录
     *
     * @return {string} ../build/intermediates/shell/[target]/src/main/java/
     */
    getIntermediatesShellJavaDir: () => string;
    /**
     * 生成的shell class代码目录
     *
     * @return {string} ../build/intermediates/shell/[target]/build/classes
     */
    getIntermediatesShellClassDir: () => string;
    /**
     * 生成的class文件目录
     *
     * @return {string} ../build/intermediates/class/[target]
     */
    getIntermediatesClassDir: () => string;
    /**
     * 生成的dex目录
     *
     * @return {string} ../build/intermediates/dex/[target]
     */
    getIntermediatesDexDir: () => string;
    /**
     * 生成的dex目录
     *
     * @return {string} ../build/intermediates/shell/[target]/build/dex
     */
    getIntermediatesShellDexDir: () => string;
    /**
     * 生成的shell目录
     *
     * @return {string} ../build/intermediates/shell/[target]/src/main/
     */
    getShellSrcMain: () => string;
    /**
     * 构建过程中shell工程的res资源目录
     *
     * @return ../build/intermediates/shell/[target]/src/main/res
     */
    getShellResourceDir: () => string;
}

declare interface LegacyTargetSourceSetModel extends SourceSetModel {
    /**
     * 获取Fa模型资源模型
     *
     * @return LegacyModuleTargetRes
     */
    getLegacyModuleTargetRes: () => LegacyModuleTargetRes;
}

declare interface librariesInfo extends Option_2 {
    name: string;
    linkLibraries?: string[];
}

/**
 * 日志
 */
declare type Log = {
    type: LogType;
    time: string;
    workerId: number;
};

declare enum LogCombineType {
    IGNORE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4
}

declare class LogEvent extends BaseEvent {
    additional: LogEventAdditional;
    constructor(id: string, name: string, description: string, pid: number, tid: string, type: MetricLogType);
    getLogType(): MetricLogType;
    setLogType(type: MetricLogType): void;
    getDurationId(): string | undefined;
    setDurationId(durationId: string): void;
    getContinualId(): string | undefined;
    setContinualId(continualId: string): void;
    addChild(id?: string): void;
    setParent(id: string): void;
}

declare class LogEventAdditional implements EventAdditional {
    logType: MetricLogType;
    durationId?: string;
    continualId?: string;
    parent?: string;
    children: string[];
    constructor(logType: MetricLogType);
}

/**
 * 日志类型
 *
 * @since 2022/8/18
 */
declare enum LogType {
    WORK = 'work',
    SCHEDULE = 'schedule'
}

declare enum MetricEventType {
    DURATION = 'duration',
    INSTANT = 'instant',
    COUNTER = 'counter',
    GAUGE = 'gauge',
    OBJECT = 'object',
    METADATA = 'metadata',
    MARK = 'mark',
    LOG = 'log',
    CONTINUAL = 'continual'
}

declare enum MetricLogType {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DETAIL = 'detail'
}

/**
 * Plugin插件中的通用基础模型定义
 *
 * @since 2022/2/23
 */
declare interface Model {
    /**
     * module/project的名称
     */
    getName: () => string;
    /**
     * 获取构建文件build-profile.json5的配置文件的路径
     */
    getProfilePath: () => string;
    /**
     * 构建文件名称,当前一般为build-profile.json5
     */
    getBuildProfileName: () => string;
    /**
     * module/project的根目录
     */
    getProjectDir: () => string;
    /**
     * module/project的远程hsp目录
     */
    getRemoteHspPath: () => string;
    /**
     * package.json的路径
     */
    getPackageJsonPath: () => string;
    /**
     * oh-package.json5的路径
     */
    getOhPackageJson5Path: () => string;
    /**
     * 判断是否是ohpm工程
     */
    isOhpmProject: () => boolean;
    /**
     * 获取编译使用的api版本号
     */
    getCompileApiMetaByProduct: (product: string) => ProjectBuildProfile.ApiMeta;
    /**
     * 获取编译使用的兼容api版本号
     */
    getCompatibleApiMetaByProduct: (product: string) => ProjectBuildProfile.ApiMeta;
    /**
     * 获取编译使用的兼容api版本号
     */
    getTargetApiMetaByProduct: (product: string) => ProjectBuildProfile.ApiMeta | undefined;
    /**
     * 获取compatibleSdkVersion原始值(用户配置的值)
     */
    getOriginCompatibleSdkVersionByProduct: (product: string) => string | number | undefined;
    /**
     * 获取编译使用的api版本号
     */
    getProductApiMeta: (product: string) => ProjectBuildProfile.ProductApiMeta | undefined;
    /**
     * 获取所有子模块的ModuleModel对象
     *
     * @return {ModuleModel[]}
     */
    getAllModules: () => ModuleModel[];
}

/**
 * hvigor项目中的子模块module
 *
 * @since 2022/1/8
 */
export declare interface Module extends TaskManager, Class {
    /**
     * 获取Module名称
     *
     * @return {string} name
     */
    getName: () => string;
    /**
     * 获取Module的hvigorFile.js路径
     *
     * @return {string} hvigorFile.js path
     */
    getBuildFilePath: () => string;
    /**
     * 获取Module的build-profile.json5路径
     *
     * @return {string} build-profile.json5 path
     */
    getBuildProfilePath: () => string;
    /**
     * 获取模块路径
     *
     * @return {string} node path
     */
    getNodeDir: () => string;
    /**
     * 获取Module的packageJson
     *
     * @return {string} package.json path
     */
    getPackageJsonPath: () => string;
    /**
     * 通过名称获取Module
     *
     * @param {string} moduleName
     * @return {Module|undefined}
     */
    findModuleByName: (moduleName: string) => Module | undefined;
    /**
     * 注入plugin对象
     *
     * @param {HvigorSystemPlugin} plugin
     */
    bindPlugin: (plugin: HvigorSystemPlugin) => void;
    /**
     * 注入metaInfo上下文
     *
     * @param {string} pluginId 插件标识
     * @param {Function} func context Function
     */
    bindPluginContextFunc(pluginId: string, func: Function): void;
    /**
     * 获取plugin对象
     *
     * @param {string} pluginId
     * @return {HvigorSystemPlugin|undefined}
     */
    getPluginById: (pluginId: string) => HvigorSystemPlugin | undefined;
    /**
     * 根据pluginId获取MetaInfo信息
     *
     * @param {string} pluginId
     */
    getContext(pluginId: string): any;
    /**
     * 获取当前节点加载的所有pluginId
     *
     * @return {string[]}
     */
    getAllPluginIds(): string[];
    /**
     * 获取根项目project
     *
     * @return {Project}
     */
    getProject: () => Project;
    loadConfig(config: any): void;
    getConfigOpt: () => Config;
    addExtraOption(key: string, value: any): void;
    getExtraOption(key: string): any;
    beforeNodeEvaluate(fn: Consumer<HvigorNode>): void;
    afterNodeEvaluate(fn: Consumer<HvigorNode>): void;
    executeNodeHook(hookTpye: HookType.beforeNodeEvaluate | HookType.afterNodeEvaluate): Promise<void>;
    afterBindSystemPlugins(fn: Consumer<HvigorNode>): void;
    executeAfterBindSystemPluginsHook(): Promise<void>;
}

declare interface ModuleBuildOpt extends HapModuleBuildOpt, HarModuleBuildOpt {
}

/**
 * 模块级别的build-profile.json5的pattern
 * 所有需要配到project.json5的数据通过对应接口提供，
 * 若该接口中未定义，则认为是开发者手动加了不支持的字段(开发态无法联想)
 *
 * 命名规范:
 *   1. 每一个子标签都以xxxBuildOpt结尾
 *   2. 如果project跟Module有相同命名的字段，加一个project/module的前缀区分
 */
declare namespace ModuleBuildProfile {
    interface ConfigOpt {
        buildOption?: BuildOpt;
        deviceType?: string[];
        distroFilter?: DistroFilterBuildOpt;
        distributionFilter?: DistroFilterBuildOpt;
        atomicService?: AtomicServiceObj;
    }
    interface AtomicServiceObj {
        preloads: {
            moduleName: string;
        }[];
    }
    interface DistroFilterBuildOpt {
        apiVersion?: ApiVersionOpt;
        screenShape?: ScreenShapeOpt;
        screenWindow?: ScreenWindowOpt;
        screenDensity?: object;
        countryCode?: object;
    }
    interface ApiVersionOpt {
        policy: string;
        value: number[];
    }
    interface ScreenShapeOpt {
        policy: string;
        value: string[];
    }
    interface ScreenWindowOpt {
        policy: string;
        value: string[];
    }
    interface AbilityBuildOpt extends Named {
        pages?: string[];
        res?: string[];
        icon?: string;
        label?: string;
        launchType?: string;
    }
    interface SourcesOpt {
        abilities?: AbilityBuildOpt[];
        pages?: string[];
        sourceRoots?: string[];
    }
    interface ModuleTargetBuildOpt extends RequiredNamed, Configurable {
        source?: SourcesOpt;
        resource?: ResourceBuildOpt;
        config?: ConfigOpt;
        buildOption?: BuildOpt;
        output?: OutputOpt;
    }
    interface ResourceBuildOpt {
        directories?: string[];
    }
    interface ModuleBuildOpt extends Configurable {
        apiType?: ApiType;
        buildOption?: BuildOptionWithName;
        buildOptionSet?: BuildOptionWithName[];
        buildModeBinder?: BuildModeBinder[];
        targets?: ModuleTargetBuildOpt[];
        entryModules?: string[];
    }
    interface BuildModeBinderMapping extends Record<string, unknown> {
        targetName: string;
        buildOptionName: string;
    }
    interface BuildModeBinder extends Record<string, unknown> {
        buildModeName: string;
        mappings?: BuildModeBinderMapping[];
    }
}

/**
 * Module的依赖信息集合
 *
 * @since 2022/5/7
 */
declare class ModuleDependencyInfo {
    /**
     * har module 依赖的map集合
     * key - module name
     * value -module package.json path
     *
     * @private
     */
    private readonly _moduleDependencyMap;
    private readonly _moduleDependencyCategory;
    private readonly _npmDependencies;
    private readonly _allDependencies;
    private readonly _npmDependenciesObj;
    private readonly _hasHspDependency;
    private readonly _self;
    private readonly _modulePkgNode;
    private readonly _projectPkgNode;
    /**
     * 储存当前模块的直接依赖，注意：工程级的依赖，也视为模块的直接依赖，示例：
     * 1.模块级的oh-package.json5配置：
     * dependencies: dayjs, har1
     * dynamicDependencies: hsp1
     * devDependencies: pako
     * 2.工程级的oh-package.json5配置：
     * dependencies: har2
     * dynamicDependencies: hsp2
     * devDependencies: @ohos/hypium
     *
     * 则，根据依赖优先规格：模块dependencies > 模块dynamicDependencies  > 工程dependencies > 工程dynamicDependencies > 模块devDependencies > 工程devDependencies，
     * 收集结果如下：
     * [dayjs, har1, hsp1, har2, hsp2, pako, @ohos/hypium]
     * @private
     */
    private _directPkgNodes?;
    private readonly _log;
    constructor(self: Dependency, modulePkgNode: ModulePkgNode, projectPkgNode: ModulePkgNode | undefined, moduleDependencyMap: Map<string, Dependency>, npmDependencies: Dependency[]);
    /**
     * 同名依赖收集优先级：模块dependencies > 模块dynamicDependencies  > 工程dependencies > 工程dynamicDependencies > 模块devDependencies > 工程devDependencies
     * 根据此规格，移除掉同名的依赖模块
     * @param nodes
     * @private
     */
    private keepDependencyNameUnique;
    /**
     * 同名依赖收集优先级：模块dependencies > 模块dynamicDependencies  > 工程dependencies > 工程dynamicDependencies > 模块devDependencies > 工程devDependencies
     * 根据此规格，合并模块级与工程级依赖
     * @param modulePkgNodes
     * @param projectPkgNodes
     * @private
     */
    private getMergedPkgNodes;
    /**
     * 对字节码HAR用到全局依赖进行依赖回填
     * @param node
     * @param globalPkgNodes
     * @private
     */
    private backFillPkgNodes;
    /**
     * 合并模块级依赖和工程级依赖，构建完整的依赖树，只涉及遍历，不涉及io
     * @private
     */
    private buildDirectPkgNodes;
    getDirectPkgNodes(): ModulePkgNode[];
    getSelfAsDependency(): Dependency;
    getModulePkgNode(): ModulePkgNode;
    getProjectPkgNode(): ModulePkgNode | undefined;
    /**
     * 依赖的本地模块与其模块名的键值对
     * @returns {Map<string, Dependency>}
     */
    getModuleDependencyMap(): Map<string, Dependency>;
    /**
     * 依赖的本地模块与其模块名的键值对
     * @returns {[string, Dependency][]}
     */
    getModuleDependenciesByType(targetType: string): [string, Dependency][];
    /**
     * 依赖的鸿蒙依赖，包括本地开发态的模块与发布态的远程或者本地依赖
     * @returns {Dependency[]}
     */
    getNpmDependencies(): Dependency[];
    /**
     * 全部依赖，包括本地开发态的模块与发布态的远程或者本地依赖，so，ohpm，npm等依赖
     * @returns {Dependency[]}
     */
    getAllDependencies(): Dependency[];
    /**
     * 判断当前模块是否有hsp依赖
     */
    hasHspDependency(): boolean;
    getHspDependencies(): Dependency[];
    getHarDependencies(): Dependency[];
}

declare namespace ModuleJson {
    import AppObj = AppJson.AppObj;
    import UrisObj = ConfigJson.UrisObj;
    interface SkillsObj {
        actions?: string[];
        entities?: string[];
        uris?: UrisObj[];
        permissions?: string[];
        domainVerify?: boolean;
    }
    interface AbilityObj extends RequiredNamed {
        srcEntrance?: string;
        srcEntry?: string;
        description?: string;
        icon?: string;
        label?: string;
        orientation?: string;
        visible?: boolean;
        skills?: SkillsObj[];
        launchType?: string;
        moduleName?: string;
        startWindow?: string;
        metadata?: MetadataObj[];
    }
    interface FormObj extends RequiredNamed {
        updateEnabled: boolean;
        scheduledUpdateTime?: number;
        updateDuration?: number;
        supportDimensions: string[];
        defaultDimension: string;
    }
    interface FormsObj extends Option_2 {
        forms: FormObj[];
    }
    interface MetadataObj extends Named {
        resource?: string;
        value?: string;
    }
    interface UsedSceneObj extends Option_2 {
        abilities?: string[];
        when?: string;
    }
    interface RequestPermissionObj extends RequiredNamed {
        reason?: string;
        usedScene?: UsedSceneObj;
    }
    interface DependencyObj {
        moduleName: string;
        bundleName?: string;
        versionCode?: number;
    }
    interface AtomicServiceObj {
        preloads: {
            moduleName: string;
        }[];
    }
    interface ExtensionAbilityObj extends RequiredNamed {
        srcEntrance?: string;
        srcEntry?: string;
        icon?: string;
        description?: string;
        type: string;
        visible?: boolean;
        metadata?: MetadataObj[];
    }
    interface ModuleObj extends RequiredNamed {
        type: string;
        packageName?: string;
        srcEntrance?: string;
        srcEntry?: string;
        description?: string;
        mainElement?: string;
        deviceTypes: string[];
        deliveryWithInstall?: boolean;
        installationFree?: boolean;
        pages: string;
        routerMap: string;
        crossAppSharedConfig: string;
        appStartup: string;
        systemTheme?: string;
        abilities?: AbilityObj[];
        extensionAbilities?: ExtensionAbilityObj[];
        virtualMachine?: string;
        compileMode?: CompileModeEnum;
        metadata?: MetadataObj[];
        requestPermissions?: RequestPermissionObj[];
        definePermissions?: DefinePermissionsObj[];
        dependencies?: DependencyObj[];
        libIsolation?: boolean;
        atomicService?: AtomicServiceObj;
        proxyData?: ProxyDataObj[];
        formExtensionModule?: string;
        formWidgetModule?: string;
        deduplicateHar?: boolean;
    }
    interface DefinePermissionsObj extends Named {
        grantMode?: string;
        availableLevel?: string;
        provisionEnable?: boolean;
        distributedSceneEnable?: boolean;
        label?: string;
        description?: string;
    }
    interface ProxyDataObj {
        uri: string;
        requiredReadPermission: string;
        requiredWritePermission: string;
        metadata: MetadataObj;
    }
    interface ShortcutsObj {
        shortcutId: string;
        label: string;
        icon: string;
        wants: WantsObj[];
    }
    interface WantsObj {
        bundleName: string | undefined;
        abilityName: string;
    }
    interface ModuleOptObj {
        module: ModuleObj;
        app: AppObj;
    }
}

/**
 * ohos模块模型
 *
 * 1 模块的路径
 * 2 该模块包含的构建文件
 * 3 package.json
 * 4 开发者输入集合(源码，配置，资源等)
 */
declare interface ModuleModel extends Model {
    /**
     * 刷新模型数据，从BuildProfileLoader中重新读取
     */
    refreshData: () => void;
    /**
     * 返回该模块关联的entry模块
     */
    getRelatedEntryModules: () => string[] | undefined;
    /**
     * 获取build-profile.json5配置文件的对象
     */
    getProfileOpt: () => ModuleBuildProfile.ModuleBuildOpt;
    /**
     * 判断该模块是否是ark
     */
    isArkModule: () => boolean;
    /**
     * 判断该模块是否是hap
     */
    isHapModule: () => boolean;
    /**
     * 判断该模块是否是har
     */
    isHarModule: () => boolean;
    /**
     * 判断该模块是否是hsp
     */
    isHspModule: () => boolean;
    /**
     * 获取该模块的类型
     */
    getModuleType: () => ModuleType;
    /**
     * 判断该模块是否为元服务
     * @returns {boolean}
     */
    isAtomicService: () => boolean;
    /**
     * 判断该target是否为分布式卡片包模块
     * @returns {boolean}
     */
    isFormWidgetModule: (targetName: string) => boolean;
    /**
     * 判断该模块是否为使用分布式卡片包的hap模块
     * @returns {boolean}
     */
    isFormExtensionModule: (targetName: string) => boolean;
    /**
     * 判断该模块是否为installFree
     * @returns {boolean}
     */
    isInstallFree: () => boolean;
    /**
     * 获取module对应的target的根目录
     *
     * 1.针对一般的target,当前统一为../{Module_Path}/src/main
     *
     * 2.针对ohosTest这个特殊的target,为../{Module_Path}/src/ohosTest
     */
    getSourceRootByTargetName: (targetName: string) => string;
    /**
     * 获取module对应的target的源码集对象
     */
    getSourceSetByTargetName: (targetName: string) => SourceSetModel;
    /**
     * 获取根模块project对象
     */
    getParentProject: () => ProjectModel;
    /**
     * 根据target的name获取不同target下的对应的config.json或module.json5转换的json对象
     *
     * @param targetName 模块的target名
     */
    getJsonObjByTargetName: (targetName: string) => ConfigJson.ConfigOptObj | ModuleJson.ModuleOptObj;
    /**
     * 获取当前模块的所有设备
     *
     * @returns {string[]}
     */
    getDeviceTypes(): string[];
    getTargetOptions(): ModuleBuildProfile.ModuleTargetBuildOpt[];
    /**
     * 获取当前模块的apiType, 默认为stage模型
     *
     * @returns {ApiType}
     */
    getApiType(): ApiType;
    /**
     * 获取vigor-base中定义的模块结构
     *
     * @returns {Module}
     */
    getModule(): Module;
    /**
     * 获取当前工程的编译模式, 默认为jsBundle
     *
     * @returns {CompileModeEnum}
     */
    getCompileMode(product: ProjectBuildProfile.ProductBuildOpt): CompileModeEnum;
    /**
     * 根据target的name获取不同target下的对应的config.json或module.json5的路径
     *
     * @param targetName 模块的target名
     */
    getJsonPathByTargetName(targetName: string): string;
    /**
     * 获取当前模块所有的target数据
     */
    getAllTargetSourceSet(): ReadonlyMap<string, SourceSetModelType>;
    /**
     * 返回mock配置文件的路径，默认是 src/mock/mock-config.json5
     */
    getMockConfigPath(): string;
    /**
     * 获取belongProjectPath
     */
    getBelongProjectPath(): string;
    /**
     * 用户rollup自定义插件绝对路径
     */
    getCompilePluginPath(): string | undefined;
    /**
     * 模块profile目录下是否有卡片配置文件
     *
     * @return {boolean}
     */
    hasFormConfig(targetName: string): boolean;
}

declare class ModulePathInfoIml implements LegacyPathInfo, PathInfo {
    private readonly _curModule;
    private readonly _targetName;
    private readonly _modulePath;
    private readonly _productName;
    private readonly _buildRoot;
    constructor(curModule: ModuleModel, targetName: string, productName: string, buildRoot?: string);
    getPatchDir(): string;
    getObfuscationExportRulePath(): string;
    getIntermediatesJavaDir(): string;
    getIntermediatesClassDir(): string;
    getIntermediatesDexDir(): string;
    getIntermediatesShellClassDir(): string;
    getIntermediatesShellDexDir(): string;
    getIntermediatesShellJavaDir(): string;
    getIntermediatesApkDir(): string;
    getBuildRoot(): string;
    getModuleBuildPath(supportBuildCacheDir?: boolean): string;
    getModuleSrcPath(): string;
    getModuleSrcMainPath(): string;
    getModuleSrcMockPath(): string;
    getModulePath(): string;
    getModuleSrcMainResourceRawfileArkdataPath(): string;
    getModuleSrcMainResourceRawfileUtdPath(): string;
    getModuleSrcMainResourceBaseProfilePath(): string;
    getModulePreviewPath(): string;
    getModuleProductPath(supportBuildCacheDir?: boolean): string;
    getModuleTestPath(): string;
    getModulePreviewProductPath(): string;
    /**
     * .preview/${productName}/intermediates/res/${targetName}
     */
    getModulePreviewIntermediatesResPath(): string;
    /**
     * .preview/${productName}/intermediates/res/${targetName}/resources/base/profile
     */
    getModulePreviewIntermediatesProfilePath(): string;
    getModuleBuildIntermediates(): string;
    getModuleBuildGenerated(): string;
    getModulePreviewBuildGenerated(): string;
    getModuleBuildOutputPath(): string;
    getModuleBuildOhosTestOutputPath(): string;
    getIntermediatesMergeRes(): string;
    getIntermediatesPacJsonDir(): string;
    getIntermediatesPacJsonPath(): string;
    getPacJsonPath(): string;
    getIntermediatesMergeFile(): string;
    getIntermediatesMergeProfile(): string;
    getIntermediatesProcessProfileDir(): string;
    getGenerateSourceR(): string;
    getGeneratePmDir(): string;
    getGenerateBuildProfilePath(targetName: string): string;
    getHarGenerateBuildProfilePath(): string;
    getGenerateModuleInfoPath(): string;
    getGenerateBuildProfileDir(): string;
    getPreviewGenerateSourceR(): string;
    getIntermediatesProcessProfile(): string;
    getIntermediatesArkModuleJsonPath(): string;
    getIntermediatesProcessLegacyProfile(): string;
    getIntermediatesRes(): string;
    getIntermediatesResDeduplicate(): string;
    getDeduplicateResConfigPath(): string;
    getIntermediatesOhosTestResourceStr(): string;
    /**
     * 编译过程中sdk中处理生成mock-config.json的路径
     * /build/intermediates/res/${targetName}/mock-config.json
     *
     * @returns {string}
     */
    getIntermediatesMockConfigJsonFile(): string;
    /**
     * 中间临时mock目录,打包到目标产物中的mock相关的内容
     * /build/intermediates/res/${targetName}/resources/rawfile/mock
     *
     * @returns {string}
     */
    getIntermediatesResourcesRawFileMockDir(): string;
    /**
     * restool编译结果的产物profile的路径
     * 其中resources,base,profile是固定的，是restool中的定义
     *
     * @return ../intermediates/res/{targetName}/res/base/profile
     */
    getIntermediatesResProfilePath(): string;
    /**
     * har包去重restool编译结果的产物profile的路径
     * @return ../intermediates/res_deduplicate/{targetName}/res/base/profile
     */
    getIntermediatesResDeduplicateProfilePath(): string;
    /**
     * arkData编译结果的产物arkdata路径
     *
     * @return ../intermediates/res/{targetName}/resources/rawfile/arkdata/schema
     */
    getIntermediatesResArkDataPath(): string;
    getIntermediatesFaAssetsPath(product: ProjectBuildProfile.ProductBuildOpt): string;
    getInterMediatesLoaderOutPath(): string;
    getInterMediatesSourceMapDirPath(): string;
    /**
     * 返回intermediate中的sourceMap的路径，若不存在就返回空字符串
     */
    getSourceMapIntermediatePath(): string;
    /**
     * 返回origin的sourceMap的路径,release和debug模式下路径不同
     * har的产物目录跟hap hsp的产物目录下的名称有所不同，需要进行区分
     * @input TargetTaskService
     */
    getSourceMapOriginPath(targetService: TargetTaskService): string;
    getInterMediatesAssetsPath(): string;
    getInterMediatesLoaderOutLitePath(): string;
    getIntermediatesLoaderPath(): string;
    /**
     * har包去重中间文件存储路径
     */
    getIntermediatesHarDuplicatePath(): string;
    /**
     * 获取har包去重场景处理后的用户自定义的idDefinedFilePath文件存储路径
     * idDefinedFilePath配置一个.json5文件，但restool只支持.json文件,把json5处理成json文件存到这个目录下传递给restool的definedIds字段
     */
    getIntermediatesIdDefinedPath(): string;
    /**
     * 获取用户自定义idDefinedFilePath json5 转换后的 json 文件
     */
    getIntermediatesIdDefinedJsonFile(): string;
    getIntermediatesEtsTgzPath(moduleName: string): string;
    /**
     * 语义信息表路径
     */
    getIntermediatesPkgContextInfoPath(): string;
    getIntermediatesApPath(): string;
    getModuleBuildCachePath(): string;
    getIntermediatesMergeLegacyProfile(): string;
    getIntermediatesLegacyManifestJson(): string;
    getIntermediatesPackInfoDir(): string;
    getIntermediatesProcessLibs(): string;
    getIntermediatesStrippedLibsDir(): string;
    getIntermediatesPatch(): string;
    getIntermediatesSysCap(): string;
    getIntermediatesRouterMap(routerMapFileName: string): string;
    getIntermediatesShareConfig(shareConfigFileName: string): string;
    getIntermediatesStartupPath(startupFileName: string | undefined): string;
    getCppOutputDir(): string;
    getNinjaWorkDir(): string;
    getModuleShellDir(): string;
    getShellResourceDir(): string;
    getShellSrcMain(): string;
    getShellBuildResourceDir(): string;
    getIntermediatesCppOutPut(): string;
    getIntermediatesLiteBinSource(): string;
    getModuleBinOutput(): string;
    getIntermediatesLiteSource(): string;
    getIntermediatesTemp(): string;
    /**
     * 获取预览和调试对应的编译参数配置文件路径
     *
     * @param isPreview 是否是预览模式
     * @returns {string} 编译参数配置文件路径
     */
    getBuildConfigPath(isPreview?: boolean): string;
    getIntermediatesOutputMetadata(): string;
    getTestBuildConfigPath(): string;
    getIntermediatesHspOutputMetadata(): string;
    getFromConfigPathByTargetName(moduleModel: CoreModuleModelImpl, targetName: string, formConfigName: string | undefined): string | undefined;
    getSyscapJsonPathInfo(moduleModel: ModuleModel): string;
    getPreviewIntermediatesResModuleJsonPath(): string;
    getPreviewIntermediatesMainPagesJsonPath(): string;
    getUnitTestTemplatePath(): string;
    /**
     * 仓颉构建产物路径
     * @returns {string} 产物路径/intermediates/cj/extend_libs/{targetName}
     */
    getIntermediatesCangjieOutPut(): string;
    /**
     * 获取集成态hsp存储目录
     */
    getIntegratedHspOutputPath(): string;
    getDefaultSourceMapPath(): string;
    /**
     * 打包工具生成的缓存文件/中间产物路径
     */
    getPackageHapProductPath(): string;
    /**
     * Intermediate fastapp output path
     */
    getFastAppStorageDirectory(): string;
    /**
     * 根据HSP、HAR模块路径获取对顶的 resource_str目录
     */
    getDependencyResourceStr(modulePath: string): string;
    /**
     * 根据app,hap, hsp,字节码har, 源码har 获取对应的symbol路径
     */
    getSymbolsDir(modulePath: string): string;
    /**
     *  获取 resource_str目录
     */
    getResourceStr(): string;
    /**
     * loader.json路径
     */
    getLoaderJsonPath(): string;
    /**
     * 记录hsp搜集到的要去重的源码har文件
     */
    getSourceHarDuplicateFilesInfoPath(): string;
    /**
     * 记录hsp搜集到的要去重的字节码har引用
     */
    getByteCodeHarDuplicateFilesInfoPath(): string;
    /**
     * 记录hsp需要去重的har的相关信息
     */
    getHarDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的har的语境信息表信息
     */
    getPkgContextInfoDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的资源信息
     */
    getResourcesDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的RouterMap信息
     */
    getRouterMapDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的loader-router-map信息
     */
    getLoaderRouterMapDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的启动框架信息
     */
    getStartupDuplicateInfoPath(): string;
    getAbilityDuplicateInfoPath(): string;
    /**
     * 记录hsp需要去重的so信息
     */
    getSoDuplicateInfoPath(): string;
    /**
     * widget_loader.json路径，用于辅助卡片编译
     */
    getWidgetLoaderJsonPath(): string;
    getObfCachePath(): string;
    getObfNameCachePath(): string;
    getByteCodeObfConfigPath(): string;
    getPreloadSoFilePath(): string;
}

declare interface ModulePkgNode {
    moduleName: string;
    modulePkgJsonPath: string;
    parent?: ModulePkgNode;
    children: ModulePkgNode[];
    npm: Dependency;
    module?: DefaultModuleDependency;
}

/**
 * 针对每一个Module中的target初始化的一个数据对象
 *
 * @since 2021/12/24
 */
declare class ModuleTargetData {
    private readonly _moduleModel;
    private readonly _target;
    private readonly _pathInfo;
    private readonly _product;
    private readonly _targetStatus;
    private readonly _moduleSourceSetModel;
    private readonly compileApiVersion;
    private readonly compatibleApiVersion;
    private readonly originCompatibleSdkVersion;
    private readonly compatibleSdkVersionStage;
    private readonly targetSdkVersion;
    private readonly _apiMeta;
    private _log;
    constructor(moduleModel: ModuleModel, target: ModuleBuildProfile.ModuleTargetBuildOpt, pathInfo: ModulePathInfoIml, product: ProjectBuildProfile.ProductBuildOpt);
    isHarmonyOS(): boolean;
    getApiMeta(): ProjectBuildProfile.ProductApiMeta;
    getCompileApiVersion(): number;
    getCompatibleApiVersion(): number;
    /**
     * 返回compatibleSdkVersion原始值(用户配置的值)
     *
     * @returns {string}
     */
    getOriginCompatibleSdkVersion(): string | number | undefined;
    getTargetSdkVersion(): number | undefined;
    getCompatibleSdkVersionStage(): string | undefined;
    /**
     * 返回该target对应的模块模型
     */
    getModuleModel(): ModuleModel;
    getModuleSourceSetModel(): SourceSetModel;
    /**
     * 返回该target对应的模块关联的entry模块
     */
    getRelatedEntryModules(): string[] | undefined;
    getTargetName(): string;
    getTargetOpt(): ModuleBuildProfile.ModuleTargetBuildOpt;
    getPathInfo(): ModulePathInfoIml;
    /**
     * 根据入参获取hap包的名字, 格式为: moduleName(-entryName)-targetName(-signed).hap
     * 入参是null时, 不带是否签名
     *
     * @param {string} entryName 模块可能关联的entry名
     * @param {boolean | null} isSigned 是否签名
     * @param suffix 打出包的包格式,默认是.hap
     * @param deviceType 富瘦设备类型
     * @param targetName 当前target名
     * @returns {string}
     */
    getModuleTargetOutputFileName(entryName: string, isSigned: boolean | null, suffix?: string, deviceType?: string, targetName?: string): string;
    /**
     * 获取本模块的apk名称
     * 注意: 只在fa模型中调用该方法
     *
     * @param {boolean} isCut 是否是cutApk
     * @returns {string}
     */
    getApkName(isCut?: boolean): string;
    getTargetStatus(): Status;
    getProduct(): ProjectBuildProfile.ProductBuildOpt;
    /**
     * 根据name寻找其他模块的targetData
     * 若没有该模块, 或者该模块下没有同名的targetName, 则返回undefined
     *
     * @param {string} name
     * @param {string} target
     * @returns {ModuleTargetData | undefined}
     */
    findTargetDataByName(name: string, target?: string): ModuleTargetData | undefined;
    /**
     * 根据所关联entry模块name查找target
     * 存在同名则返回同名target 否则返回default
     *
     * @param entryName 与feature模块关联的entry模块Name
     */
    findRelatedTargetData(entryName: string): ModuleTargetData | undefined;
    /**
     * 根据config.json中的抽象的ability对象, 寻找target中对应的配置
     *
     * @param {LegacyAbilityModel} abilityObj
     * @returns {ModuleBuildProfile.AbilityBuildOpt | undefined}
     */
    findTargetConfigOpt(abilityObj: LegacyAbilityModel): ModuleBuildProfile.AbilityBuildOpt | undefined;
    /**
     * 获取target中配置的设备类型,
     * 若没有配置, 或配置为空的数组, 返回配置文件中的deviceType
     * 若target中的设备类型不是模块的子集, 则报错
     *
     * @returns {string[]}
     */
    getTargetDeviceType(): string[];
    /**
     * 判断是否包含富设备
     */
    hasRichDeviceInTarget(): boolean;
    /**
     * 判断是否包含瘦设备
     */
    hasLiteDeviceInTarget(): boolean;
    /**
     * 判断是否是混合设备
     */
    isMixedDeviceTarget(): boolean;
    /**
     * 判断是否是纯富设备
     */
    isPurerRichDeviceTarget(): boolean;
    /**
     * 判断是否是纯瘦设备
     */
    isPurerLiteDeviceTarget(): boolean;
    /**
     * 判断是否是纯N设备
     */
    isPurerNDeviceTarget(): boolean;
    /**
     *  返回设备类型的分类
     *
     *  @returns {[string]}
     */
    getTargetDeviceTypeClasses(): Array<string>;
    /**
     * 判断是否是纯富/瘦设备类型
     *
     * @return {boolean}
     */
    isSingleDeviceTypeTarget(): boolean;
}

declare interface ModuleTargetRes extends ResModel {
    /**
     * 获取target下module.json5的对象
     */
    getModuleJsonOpt(): ModuleJson.ModuleOptObj;
    /**
     * 获取target下form_config.json5的对象
     */
    getFormJsonOpt(formPath: string): ConfigJson.FormsObj;
}

/**
 * 基于持久化module的模型层提供的数据，经过处理后,提供给打包hap任务流需要使用的服务和数据
 *
 * @since 2022/1/20
 */
declare class ModuleTaskService extends TaskService {
    private readonly _moduleModel;
    private readonly _status;
    private readonly _targetDataSet;
    private readonly _targets;
    private readonly _targetArtifactNames;
    constructor(projectModel: ProjectModel, moduleModel: ModuleModel, dependencyManager: DependencyManager, isFaMode: boolean);
    getModuleModel(): CoreModuleModelImpl;
    getTargetDataSet(): Set<[ModuleTargetData, boolean]>;
    getTargets(): Target[];
    getTargetArtifactNames(): Map<string, string>;
    isArkModule(): boolean;
    /**
     * 返回该service对应模块关联的entry模块
     */
    getRelatedEntryModules(): string[] | undefined;
    /**
     * 模块级build-profile.json5中模板不再提供entryModules字段且schema将其标识为废弃
     * 检查feature模块配置文件中entryModules字段
     */
    static checkEntryModules(moduleType: string, relatedEntryModules: string[] | undefined): boolean;
    hasLiteDevice(): boolean;
    /**
     * 初始化hap模块打包流的target数据集合, 并返回对应所有需要打包targets的状态
     */
    private initTargetData;
    /**
     * 根据name返回target信息，若没有则返回undefined
     *
     * @param {string} targetName
     * @returns {ModuleTargetData | undefined}
     */
    findTargetDataByName(targetName: string): ModuleTargetData | undefined;
    private targetNeedPack;
    /**
     * 判断模块下有没有 ohosTest/cpp 源码目录
     */
    private hasCppInOhosTest;
}

declare enum ModuleType {
    Entry = 'entry',
    Feature = 'feature',
    Har = 'har',
    Shared = 'shared'
}

/**
 * 为枚举类型ModuleType附加方法
 *
 * @since 2022/2/25
 */
declare namespace ModuleType {
    function valueOf(moduleTypeStr: string): ModuleType;
}

declare interface Named extends Option_2 {
    name?: string;
}

declare interface NapiLibFilterOpt extends Option_2 {
    excludes?: string[];
    pickFirsts?: string[];
    pickLasts?: string[];
    enableOverride?: boolean;
    select?: PkgSelection[];
}

declare type NapiLibFilterOption = {
    excludes?: string[];
    pickFirsts?: string[];
    pickLasts?: string[];
    enableOverride?: boolean;
};

declare interface NativeLib extends Option_2 {
    debugSymbol?: DebugSymbol;
    filter?: NapiLibFilterOpt;
    headerPath?: string | string[];
    collectAllLibs?: boolean;
    librariesInfo?: librariesInfo[];
    excludeFromHar?: boolean;
    excludeSoFromInterfaceHar?: boolean;
}

declare type NativeLib_2 = {
    packOptions?: PackOpt_2;
};

/**
 * 自定义的File类
 */
declare class NormalizedFile {
    readonly filePath: string;
    private logger;
    constructor(_path: string);
    /**
     * 获取到NormalizedFile对象下深层递归的目录与文件NormalizedFile[]，包含它本身
     *
     *@return NormalizedFile[]
     */
    asFileList(): NormalizedFile[];
    /** @internal */
    asFileListInternal(): NormalizedFile[];
    private _asFileList;
    /**
     * 支持在原有的目录下进行链式拼接路径
     *
     * @param _path
     * @return NormalizedFile
     */
    file(_path: string): NormalizedFile | undefined;
    /** @internal */
    fileInternal(_path: string): NormalizedFile | undefined;
    private _file;
    /**
     * 获取当前文件/目录的路径
     *
     * @return string
     */
    getPath(): string;
    /** @internal */
    getPathInternal(): string;
    private _getPath;
}

export declare type OhosAppContext = OhosProjectContext;

export declare type OhosHapContext = OhosModuleContext;

export declare type OhosHarContext = OhosModuleContext;

export declare type OhosHspContext = OhosModuleContext;

/**
 * Module级别的Plugin上下文信息
 */
declare interface OhosModuleContext {
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

/**
 * 默认的Ohos plugin中对应的三种Module的plugin id
 *
 * @since 2022/5/5
 */
export declare class OhosPluginId {
    static readonly OHOS_APP_PLUGIN = 'com.ohos.app';
    static readonly OHOS_HAP_PLUGIN = 'com.ohos.hap';
    static readonly OHOS_HAR_PLUGIN = 'com.ohos.har';
    static readonly OHOS_HSP_PLUGIN = 'com.ohos.hsp';
}

/**
 * Project级别的Plugins上下文信息
 */
declare interface OhosProjectContext {
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

declare interface OhPackageJsonOpt {
    name: string;
    version: string;
    artifactType: string;
    main: string;
    types: string;
    metadata?: {
        workers?: string[];
        declarationEntry?: string[];
        runtimeOnly?: RuntimeOnlyObj;
        resource?: ModuleBuildProfile.ResourceBuildOpt;
        sourceRoot?: string[];
    };
    parameterFile?: string;
    dependencies?: object;
}

declare interface OhpmDependencyInfo {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    packagePath: string;
    remoteHspPath?: string;
    signedRemoteHspPath?: string;
}

/**
 * 针对json/json5文件中有相同属性的配置项，可以使用泛型
 *
 * @since 2022/1/10
 */
declare type Option_2 = {
    [index: string]: unknown;
};

/**
 * target定制产物输出配置
 */
declare interface OutputOpt {
    artifactName: string;
}

declare interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    license?: string;
    licenses?: Array<{
        type?: string;
        url?: string;
    }>;
    files?: string[];
    type?: 'module' | 'commonjs';
    main?: string;
    bin?: string | Partial<Record<string, string>>;
    man?: string | string[];
    repository?: string | {
        type: string;
        url: string;
        directory?: string;
    };
    config?: Record<string, unknown>;
    dependencies?: Partial<Record<string, string>>;
    devDependencies?: Partial<Record<string, string>>;
    optionalDependencies?: Partial<Record<string, string>>;
    peerDependencies?: Partial<Record<string, string>>;
    peerDependenciesMeta?: Partial<Record<string, {
        optional: true;
    }>>;
    bundledDependencies?: string[];
    bundleDependencies?: string[];
    engines?: {
        [EngineName in 'npm' | 'node' | string]?: string;
    };
    engineStrict?: boolean;
    types?: string;
}

declare interface PackingOptAsset {
    include?: string[];
    exclude?: string[];
}

declare interface PackingOptions {
    asset?: PackingOptAsset;
    customizedOptions?: CustomizedOptions;
}

declare interface PackOpt extends RequiredNamed {
    buildAppSkipSignHap?: boolean;
    fastBuildApp?: boolean;
    enableSourceCodeCheck?: boolean;
    deduplicateHar?: boolean;
    appWithSignedPkg?: boolean;
    enableIncrementalSoCompress?: boolean;
}

declare type PackOpt_2 = {
    buildAppSkipSignHap?: boolean;
};

declare interface PathDetails {
    getModuleBuildCachePath(): string;
    getIntermediatesRes(): string;
    getModuleBuildPath(): string;
}

/**
 * 定义ohos-plugin的任务使用的中间路径
 *
 * @since 2021/12/15
 */
declare interface PathInfo {
    /**
     * 构建目录的根路径名
     *
     * @returns {string}
     */
    getBuildRoot: () => string;
    /**
     * module的构建中间产物的根路径
     *
     * @return string /build
     */
    getModuleBuildPath: () => string;
    /**
     * module的构建产物的临时目录
     *
     * @return string /build/[product]/cache
     */
    getModuleBuildCachePath: () => string;
    /**
     * module的构建产物目标路径
     *
     * @return string
     */
    getModuleBuildOutputPath: () => string;
    /**
     * 获取模块build下的OhosTest目录
     */
    getModuleBuildOhosTestOutputPath: () => string;
    /**
     * 构建处理module.json后的中间目录
     *
     * @return string
     */
    getIntermediatesProcessProfile: (compilerType: string) => string;
    /**
     * 针对hap/hsp收集依赖har的ability场景 为ark编译新增processProfile处理后的module.json源文件
     */
    getIntermediatesArkModuleJsonPath: () => string;
    /**
     * 构建处理resources后的资源编译目录
     *
     * @return string
     */
    getIntermediatesRes: () => string;
    /**
     * fa模型, 最终打包到hap里的assets目录
     *
     * @return string
     */
    getIntermediatesFaAssetsPath: (product: ProjectBuildProfile.ProductBuildOpt) => string;
    /**
     * 构建过程中ace/ets-loader生成的assets的目录
     *
     * @return string
     */
    getInterMediatesLoaderOutPath: () => string;
    /**
     * 构建过程中为不同构建模式支持debug用途，用于存放sourceMap文件的目录路径
     *
     * @return string
     */
    getInterMediatesSourceMapDirPath: () => string;
    /**
     * 构建过程中merge后的json文件的目录
     *
     * @return string
     */
    getIntermediatesMergeProfile: () => string;
    /**
     * 构建过程中merge资源后的路径
     *
     * @return string
     */
    getIntermediatesMergeRes: () => string;
    /**
     * 构建过程中merge资源后的Index文件
     *
     * @return string
     */
    getIntermediatesMergeFile: () => string;
    /**
     * 构建处理native libs后的中间目录
     *
     * @return string
     */
    getIntermediatesProcessLibs: () => string;
    /**
     * native libs中所有的so文件strip的产物
     *
     * @return string
     */
    getIntermediatesStrippedLibsDir: () => string;
    /**
     * native libs中所有的so文件strip使用的缓存文件路径
     *
     * @return string
     */
    getIntermediatesPatch: () => string;
    /**
     * 构建处理syscap后的文件目录
     *
     * @return string
     */
    getIntermediatesSysCap: () => string;
    /**
     * 构建处理routerMap临时文件目录
     * @param routerMapFileName
     */
    getIntermediatesRouterMap: (routerMapFileName: string) => string;
    /**
     * 构建处理shareConfig临时文件目录 build\{product}\intermediates\share_config\{target}\
     * @param shareConfigFileName
     * @return string
     */
    getIntermediatesShareConfig: (shareConfigFileName: string) => string;
    /**
     * 构建处理启动框架配置startup临时目录
     * @param startupFileName
     */
    getIntermediatesStartupPath: (startupFileName: string) => string;
    /**
     * 构建过程中c++代码编译输出路径 entry/.cxx
     *
     * @return string
     */
    getCppOutputDir: () => string;
    /**
     * 构建过程ninja工作目录 entry/.cxx/{product}/{target}
     */
    getNinjaWorkDir: () => string;
    /**
     * 构建过程中shell工程的res资源中间目录
     *
     * @return ../build/intermediates/shell/build/res
     */
    getShellBuildResourceDir: () => string;
    /**
     * 构建过程中c++代码编译输出目录
     *
     * @return ../build/intermediates/cmake/[target]/obj
     */
    getIntermediatesCppOutPut: () => string;
    /**
     * 构建过程中临时文件保存目录
     *
     * @return ../build/intermediates/temp
     */
    getIntermediatesTemp: () => string;
    /**
     * 构建过程中entry/feature模块build中间目录下的output_metadata.json
     *
     * @return ./build/{productName}/intermediates/hap_metadata/{targetName}/output_metadata.json
     */
    getIntermediatesOutputMetadata: () => string;
    /**
     * 构建过程中hsp模块build中间目录下的output_metadata.json
     *
     * @return ./build/{productName}/intermediates/hsp_metadata/{targetName}/output_metadata.json
     */
    getIntermediatesHspOutputMetadata: () => string;
    /**
     * 预览过程中模块.preview产物目录下module.json
     */
    getPreviewIntermediatesResModuleJsonPath: () => string;
    /**
     * 预览过程中模块.preview产物资源目录下main_pages.json
     */
    getPreviewIntermediatesMainPagesJsonPath: () => string;
    /**
     * 获取集成态hsp存储目录
     */
    getIntegratedHspOutputPath: () => string;
    /**
     * get fastapp storage directory
     */
    getFastAppStorageDirectory: () => string;
}

declare interface PkgSelection extends Option_2 {
    package: string;
    version?: string;
    include?: string[];
    exclude?: string[];
    includePattern?: string[];
    excludePattern?: string[];
}

/**
 * 池状态
 *
 * @since 2022/8/12
 */
declare enum PoolState {
    /**
     * 初始化状态，线程池在此阶段初始化各个子模块，创建最小线程数对应的线程
     */
    INIT = 'init',
    /**
     * 运行状态，线程池在此状态能正常接收外部提交的工作，并且正常执行工作
     */
    RUNNING = 'running',
    /**
     * 停止状态，线程池在此状态停止接收外部提交的工作，清空就绪队列，仅继续执行当前正在执行的工作
     */
    STOP = 'stop',
    /**
     * 关闭状态，线程池在此状态停止接收外部提交的工作，但能够正常执行当前正在执行的工作，以及就绪队列中的工作
     */
    CLOSE = 'close',
    /**
     * 终止状态，线程池在此状态活动完全终止
     */
    TERMINATED = 'terminated'
}

/**
 * 预览方构建
 *
 * @since 2022/11/29
 */
declare class PreviewBuild extends AbstractModuleHookTask {
    constructor(moduleTaskService: ModuleTaskService, isFaMode: boolean);
    initTaskDepends(taskTargetService: TargetTaskService): void;
}

/**
 * 工作单元优先级
 */
declare enum Priority {
    FIRST = 0,
    HEAVY = 1,
    MEDIUM = 2,
    LIGHT = 3,
    LAST = 4
}

/**
 * 执行命令的工具类
 *
 * @since 2021-12-14
 */
declare class ProcessUtils {
    private readonly _log;
    private readonly _moduleName;
    private readonly _taskName;
    private readonly _errLog;
    private readonly _ohosCharset;
    private readonly _solution;
    private readonly _defaultOptions;
    constructor(moduleName?: string, taskName?: string, logLevel?: string, errLog?: string, solution?: string, charset?: string);
    /**
     * 向工作池提交同步执行的命令，执行命令无返回值
     *
     * @param task
     * @param workerPool 工作池代理器
     * @param inputData 输入数据
     * @param callback 回调函数
     * @param callbackInput 回调函数的输入数据
     * @param subDurationEvent 子持续事件
     * @param targetWorkers 目标worker的集合
     * @param combine
     */
    submitExecutionWithoutReturn(task: CoreTask, workerPool: WorkerPoolDelegator, inputData: any, callback: Function, callbackInput: unknown[], subDurationEvent: DurationEvent, targetWorkers?: number[], combine?: LogCombineType): Promise<void>;
    /**
     * 向工作池提交同步执行的命令，执行命令有返回值，作为callback的输入
     *
     * @param task
     * @param workerPool 工作池代理器
     * @param funcPath 执行函数的路径
     * @param inputData 输入数据
     * @param callback 回调函数
     * @param targetWorkers 目标worker的集合
     * @returns {boolean} 是否成功提交
     */
    submitSyncExecutionWithReturn(task: CoreTask, workerPool: WorkerPoolDelegator, funcPath: string, inputData: any, callback: Function, targetWorkers?: number[]): boolean;
    private handleOutput;
    private handleException;
     /**
      * 根据process状态判断该报错是否需要打印到输出流中
      *
      * @returns {boolean}
      * @private
      */
     private needPrintWarnWhenNoReturnValue;
     /**
      * 生成execa需要的options入参
      *
      * @param options - 传入参数
      */
     private validateExecuteFile;
     private makeError;
     /**
      * native编译特殊日志处理
      *
      * @param {string} studio 执行命令返回结果
      * @param {LogCombineType} combine 日志级别
      * @private
      */
     private nativeNoReturnValueWarningHandler;
    }

    export declare interface Product {
        getProductName: () => string;
        getBundleType: () => string;
        getBundleName: () => string;
        getOutputArtifactName: () => string | undefined;
    }

    /**
     * hvigor项目中的根module
     *
     * @since 2022/1/8
     */
    export declare interface Project extends HvigorCoreNode {
        /**
         * 获取子模块
         * 根据name直接获取子模块
         *
         * @return {Map<string,Module>>}
             */
         getSubModules: () => Map<string, Module>;
         /**
          * 添加子模块
          *
          * @return {Module}
          */
         addSubModule: (module: Module) => void;
         /**
          * 获取所有的的子模块
          *
          * @return {Module[]}
          */
         getAllSubModules: () => Module[];
         /**
          * 获取节点config配置
          */
         getConfigOpt: () => any;
        }

        declare interface ProjectBuildOpt {
            packOptions?: PackOpt;
            preloadSystemSo?: boolean;
        }

        /**
         * 工程级别的build-profile.json5的pattern
         * 所有需要配到project.json5的数据通过对应接口提供，
         * 若该接口中未定义，则认为是开发者手动加了不支持的字段(开发态无法联想)
         *
         * 命名规范: 每一个子标签都以xxxBuildOpt结尾
         *
         */
        declare namespace ProjectBuildProfile {
            interface MaterialBuildOpt {
                storeFile: string;
                storePassword: string;
                keyAlias: string;
                keyPassword: string;
                signAlg: string;
                profile: string;
                certpath: string;
            }
            interface SigningConfigBuildOpt extends RequiredNamed {
                material: MaterialBuildOpt;
                type?: string;
            }
            interface ProductBuildOpt extends RequiredNamed {
                signingConfig?: string;
                bundleName?: string;
                buildOption?: BuildOpt;
                compileSdkVersion?: number | string;
                compatibleSdkVersion?: number | string;
                targetSdkVersion?: number | string;
                runtimeOS?: string;
                bundleType?: string;
                label?: string;
                versionCode?: number;
                versionName?: string;
                icon?: string;
                resource?: ProductResourceObj;
                output?: OutputOpt;
                arkTSVersion?: string;
                vendor?: string;
                compatibleSdkVersionStage?: string;
            }
            interface ProductResourceObj {
                directories: string[];
            }
            interface ProductApiMeta {
                compileSdkVersion: ApiMeta;
                compatibleSdkVersion: ApiMeta;
                targetSdkVersion: ApiMeta | undefined;
                originCompatibleSdkVersion: string | number | undefined;
            }
            /**
             * API数据
             * type:
             *   0: 10(非点分制) or '20.1.1'(点分制)
             *   1: 4.0.0(10)(非点分制) or “6.1.1(20.1.1)' (点分制)
             * api 字符串版本
             *   0: '10' or '20.1.1'
             *   1: '4.0.0' or “6.1.1'
             * type API数据类型 0: number 1: string
             * fullVersion: 用户配置的原始api版本号
             *   hos：'10'(非点分制) or '20.1.1'(点分制)
             *   oh：'10'(非点分制) or '20.1.1'(点分制)
             *   1. majorVersion、minorVersion、patchVersion均为整型，最大值为999
             *   2. majorVersion不会为0；
             *   3. 仅有majorVersion和minorVersion存在时，则minorVersion不会为0；
             *   4. majorVersion、minorVersion、patchVersion均存在时，则patchVersion不会为0
             *   5. majorVersion、minorVersion、patchVersion均不会存在前导0，即不会出01场景
             *   6. 两个API Level大小比较时，依次比较majorVersion、minorVersion、patchVersion
             * major：点分制版本号第一位
             * minor：点分制版本号第二位
             * patch：点分制版本号第三位
             */
            interface ApiMeta {
                api: string;
                version: number;
                type: ApiValType;
                fullVersion: string;
                major: number;
                minor: number | undefined;
                patch: number | undefined;
            }
            enum ApiValType {
                'NUM' = 0,
                'STRING' = 1
            }
            interface AppBuildOpt {
                supportHos?: boolean;
                signingConfigs?: SigningConfigBuildOpt[];
                compileSdkVersion?: number;
                compatibleSdkVersion?: number;
                products?: ProductBuildOpt[];
                multiProjects?: boolean;
                buildModeSet?: BuildMode[];
            }
            interface ProjectTargetBuildOpt extends RequiredNamed {
                applyToProducts: string[];
            }
            interface ModuleBuildOpt extends RequiredNamed {
                srcPath: string;
                targets?: ProjectTargetBuildOpt[];
                belongProjectPath?: string;
            }
            interface ProjectProfileOpt {
                app: AppBuildOpt;
                modules: ModuleBuildOpt[];
                crossplatform: boolean;
            }
            interface BuildMode extends RequiredNamed {
                buildOption?: BuildOpt;
            }
            interface ModuleRuntimeOS {
                targetRunTimeOS?: string;
                targetMsg?: string;
            }
            interface RemoteHspOpt {
                hspName: string;
                hspPath: string;
                hspVersion: string;
                hspFileName: string;
                hspDirName: string;
                isIntegratedHsp: boolean;
            }
            /**
             * product定制产物输出配置
             */
            interface OutputOpt {
                artifactName: string;
            }
        }

        /**
         * app级别的工程对象模型
         *
         * @since 2021/12/16
         */
        declare interface ProjectModel extends Model, TargetRegistry {
            /**
             * 刷新模型数据，从BuildProfileLoader中重新读取
             */
            refreshData: () => void;
            getProject(): Project;
            /**
             * 获取工程Project级别的build-profile.json的对象
             */
            getProfileOpt: () => ProjectBuildProfile.ProjectProfileOpt;
            /**
             * 根据moduleName获取对应module中的build-profile的配置
             *
             * @param moduleName
             */
            getModuleProfileOpt: (moduleName: string) => ProjectBuildProfile.ModuleBuildOpt | undefined;
            /**
             * 根据module的名称获取对应子模块的数据模型
             */
            getModuleModelByName: (moduleName: string) => ModuleModel | undefined;
            /**
             * 根据moduleName和targetName获取根项目下配置的applyToProducts
             *
             * @param moduleName
             * @param targetName
             */
            getTargetApplyProducts: (moduleName: string, targetName: string) => string[] | undefined;
            /**
             * 获取app-scope中定义的默认的bundleName
             */
            getDefaultBundleName: () => string;
            /**
             * 获取所有子模块对应的ModuleModel对象,需要获取跟ohos相关的信息的时候才需要调该方法
             * 注意时序问题，当前在初始化某个模块时,调用该方法会获取不了所有的subModuleModel对象
             * 如果需要在plugin中任意地方获取当前工程的所有子模块,需要调用的是project.getSubModules()
             */
            getSubModuleModels: () => Map<string, Model>;
            /**
             * 获取所有entry模块的模块名
             *
             * @returns {Set<string>}
             */
            getAllEntryModules(): Set<string>;
            /**
             * 获取工程配置的所有的product的name集合
             *
             * @return {string[]}
             */
            getProductNames(): string[];
            /**
             * 获取命令行参数-p module=配置的module和targets信息
             */
            getModuleSpecificTargets(): Map<string, string[]>;
            /**
             * 获取parameterFile文件的绝对路径
             */
            getParameterFileAbsolutePath(): string | undefined;
            getParameterFileObj(): object | undefined;
            getTargetRuntimeOSs(): TargetRuntimeOS[];
            getCacheRemoteHspPath(productName: string): string;
            getCacheIntegratedHspPath(productName: string): string;
            getBundleType(): string;
            isFaMode(): boolean;
        }

        declare class ProjectPathInfoIml {
            private readonly _projectModel;
            private readonly _productName;
            private readonly _projectPath;
            constructor(projectModel: ProjectModel, productName: string);
            getProjectBuildPath(): string;
            getProjectOutputPath(): string;
            getProjectDebugSymbolPath(): string;
        }

        /**
         * 基于持久化project的模型层提供的数据，经过处理后,提供给打包app任务流需要使用的服务和数据
         *
         * @since 2022/1/20
         */
        declare class ProjectTaskService extends TaskService {
            private _log;
            private _targetProduct;
            private _buildOption;
            private readonly _pathInfo;
            private readonly _sdkInfo;
            private readonly _productDataMap;
            constructor(project: Project, projectModel: ProjectModel, dependencyManager: DependencyManager, isFaMode: boolean);
            setup(): Promise<void>;
            getSdkInfo(): SdkInfo;
            refreshData(): void;
            /**
             * 初始化app模块打包流的product数据集合
             */
            initProductData(): void;
            getProductDataMap(): Map<string, ModuleTargetData[]>;
            getPathInfo(): ProjectPathInfoIml;
            getTargetProduct(): ProjectBuildProfile.ProductBuildOpt;
            getBuildOption(): BuildOpt;
            getAppOutputFileName(isSigned?: boolean): string;
            getAllAppOutputFileName(isSigned?: boolean): string;
            /**
             * 检查Product是否配置了ohosTarget
             * ohosTarget不需要打包进App中
             *
             * @param {ModuleTargetData} moduleTargetData moduleTarget对象
             */
            checkIsOhosTestTarget(moduleTargetData: ModuleTargetData): void;
            /**
             * 检查是否存在未定义的target
             *
             * @param moduleName 当前模块名
             * @param targetNameSet 模块已定义的target集合
             * @param appModuleConfigTargets 工程级build-profile.json5或者hvigorconfig.ts中的targets标签
             */
            private checkTargetIsUnknown;
        }

        declare interface QualifiersConfig {
            'Mcc&Mnc'?: string[];
            Locale?: string[];
            Orientation?: string[];
            Device?: string[];
            ColorMode?: string[];
            Density?: string[];
        }

        declare class Queue<T> {
            private elements;
            private readonly _capacity;
            constructor(capacity?: number);
            push(element: T): boolean;
            pop(): T | undefined;
            size(): number;
            peek(): T | undefined;
            clear(): void;
            /**
             * 如果存在则移除
             * @param search
             */
            remove(search: T): T | undefined;
            toString(): string;
        }

        /**
         * 基于Task继承的实现类,必须实现该接口,注册Task的实际执行逻辑
         *
         * @since 2022/4/22
         */
        declare abstract class Registry {
            /**
             * 通过DefaultTask继承实现的用户自定义的类，必须实现该接口，以获取该Task实际需要执行的Function
             *
             * @return {Function}
             */
            abstract registryAction(): Function;
        }

        declare interface RequiredNamed extends Named {
            name: string;
        }

        /**
         * 资源和工程配置文件的模型
         */
        declare interface ResModel {
            /**
             * 获取json文件的路径
             */
            getJsonPath(): string;
            /**
             * 获取resource目录的路径
             */
            getResourcePath(): string;
            /**
             * 获取json文件的内容
             */
            getJsonContent(): string;
        }

        declare type ResOptions = {
            [name: string]: [value: any];
        };

        declare interface RestoolCompressionConfig {
            media?: {
                enable?: boolean;
            };
            sizeLimit?: {
                ratio?: number;
            };
            filters?: RestoolCompressionFilterItem[];
        }

        declare interface RestoolCompressionFilterItem {
            method: {
                type: 'astc' | 'sut';
                blocks: '4x4';
            };
            files?: {
                path?: string[];
                size?: (number | string)[][];
                resolution?: {
                    width: number;
                    height: number;
                }[][];
            };
            exclude?: {
                path?: string[];
                size?: (number | string)[][];
                resolution?: {
                    width: number;
                    height: number;
                }[][];
            };
        }

        declare interface RuntimeOnlyObj extends Option_2 {
            sources?: string[];
            packages?: string[];
            excludePackages?: string[];
        }

        declare enum RuntimeTypeEnum {
            UNDEFINED = 0,
            OpenHarmony = 1,
            HARMONY_OS = 2
        }

        declare namespace RuntimeTypeEnum {
            function valueOf(runtimeOSStr: string | undefined): RuntimeTypeEnum;
        }

        /**
         * 公开的sdkInfo信息 定义类型
         */
        export declare interface SdkDetails {
            isOhos(): boolean;
            getSdkDir(): string;
            getSdkVersion(): number;
            getEtsComponentVersion(): string;
            getEtsComponentReleaseType(): string;
        }

        declare interface SdkInfo {
            isOhos: boolean;
            sdkDir: string;
            hasRollUpPluginInEtsLoader: boolean;
            hasRollUpPluginInJsLoader: boolean;
            setup(): void;
            getArkUIXSdkDir(): string;
            isPreviewCompileResourceIncrement(isHarmonyOS: boolean): any;
            supportOhpmProject(isHarmonyOS: boolean): any;
            supportHapSignToolApiCall(isHarmonyOS: boolean): boolean;
            /**
             * 检查当前版本sdk是否已经修复了卡片编译的问题
             * @returns {boolean}
             * @private
             */
            checkAotFixedSdkVersion(): boolean;
            /**
             * 获取当前sdk中对应api 的toolchains组件的小版本号
             *
             * @return {string | undefined}
             */
            getToolchainsComponentVersion(): string | undefined;
            getHosToolchainsComponentVersion(): string | undefined;
            getModuleSchema(): string;
            getAppSchema(): string;
            getInsightIntentSchema(): string;
            getArkDataSchema(): string;
            getUtdSchema(): string;
            getFormSchema(): string;
            getPageSchema(): string;
            getRouterMapSchema(): string;
            getShareConfigSchema(): string;
            getShortcutsJsonSchema(): string;
            getAppStartupSchema(): string;
            getHspStartupSchema(): string;
            getHarStartupSchema(): string;
            getSysCapSchema(): string;
            getPacSchema(): string;
            getResIdDefinedSchema(): string;
            getSdkJsDir(): string;
            getSdkEtsDir(): string;
            getSdkVersion(): number;
            getSdkApi(): string;
            getHapTobin(): string;
            getReleaseType(): string;
            getSdkNativeDir(): string;
            getCmakeTool(): string;
            getNativeNinjaTool(): string;
            getNativeToolchain(): string;
            getSdkToolchainsDir(): string;
            getHosToolchainsDir(): string;
            getHosToolchainsLibDir(): string;
            getLibimageTranscoderShared(): string;
            getPreviewerCommonBinDir(): string;
            getPreviewerPermissionNames(): string[];
            getPreviewerUserGrant(): string[];
            getPreviewerManualSettings(): string[];
            allowSdkPermission(): boolean;
            getSdkLlvmStrip(): string;
            getSdkLlvmReadElf(): string;
            getRestool(): string;
            getSysCapTool(): string;
            getSysCapFileInEts(): string;
            getSysCapFileInJs(): string;
            getVerifySignConfigTool(): string;
            getRichSchema(): string;
            getLiteSchema(): string;
            getArkVersion(compatibleSdkVersion: number, compatibleSdkVersionStage?: string): string;
            getEtsComponentVersion(): string;
            getEtsComponentReleaseType(): string;
            getPackageTool(): string;
            getUnPackageTool(): string;
            getSignDir(): string;
            getHosSignTool(): string;
            getJsLoader(): string;
            getEtsLoader(): string;
            requireUISyntax(): boolean;
            getHmsNativeDir(): string;
            getHmsToolchainFile(): string;
            getHmsBiShengToolchainFile(): string;
            getHmsArkDir(): string;
            getHosResTool(): string;
            getHapSignToolV2(): string;
            getHosModuleSchema(): string;
            getBasePath(): string;
            getAppConfigurationSchema(): string;
            getStartWindowSchema(): string;
            getSystemThemeSchema(): string;
        }

        declare interface SourceOpt extends Option_2 {
            workers?: string[];
        }

        declare type SourceOption = {
            workers?: string[];
        };

        /**
         * Target的源碼集合
         *
         * 1. js ets cpp
         * 2. 资源(resource + 配置文件)
         */
        declare interface SourceSetModel {
            /**
             * 获取target的sourceSet的根目录
             *
             * @return string
             */
            getSourceSetRoot: () => string;
            /**
             * 获取开发者的源码集
             *
             * @return Map<CodeType, CodeModel>
             */
            getCodeMap: () => Map<CodeType, CodeModel>;
            /**
             * 获取资源路径
             *
             * @return string
             */
            getTargetResPath: () => string;
            /**
             * 获取targetSourceSet的配置文件中的moduleName
             */
            getTargetSourceSetModuleName: () => string | undefined;
        }

        declare type SourceSetModelType = TargetSourceSetModel | LegacyTargetSourceSetModel;

        /**
         * 栈, 先进后出
         */
        declare class Stack<T> {
            private readonly stack;
            constructor();
            push(element: T): number;
            pop(): T | undefined;
            peek(): T | undefined;
            size(): number;
            isEmpty(): boolean;
        }

        /**
         * 根据配置(Configurable)生成状态码, 通过状态码判断是否支持某种属性
         * 目前支持runtimeOS配置, 若有新的配置可以拓展接口实现
         *
         * status code设计:
         * 1. 使用一串二进制数标记工程状态
         * 2. 使用&判断当前是哪些状态
         * 3. 目前只有runtimeOS维度, 使用4四位即可(见RuntimeTypeEnum), 若后续有其他拓展可拓展成8位, 16位.
         */
        declare class Status {
            private readonly _moduleBuildOpt;
            private readonly _statusCode;
            constructor(moduleProfileOpt: Configurable);
            private initRuntimeStatus;
            getStatusCode(): number;
            /**
             * 判断该状态是否是某个预设的状态
             *
             * @param {RuntimeTypeEnum} runtimeType
             * @returns {boolean}
             */
            is(runtimeType: RuntimeTypeEnum): boolean;
        }

        declare interface StrictMode extends Option_2 {
            noExternalImportByPath?: boolean;
            useNormalizedOHMUrl?: boolean;
            caseSensitiveCheck?: boolean;
            enableStrictCheckOHModule?: boolean;
            disableSendableCheckRules?: string[];
        }

        /**
         * 提交选项
         *
         * @since 2022/8/23
         */
        declare type SubmitOption = {
            workInput?: unknown;
            callback?: Function;
            callbackInput?: unknown[];
            priority?: Priority;
            targetWorkers?: number[];
            useReturnVal?: boolean;
            hasSideEffects?: boolean;
            preludeDeps?: string[];
            memorySensitive?: boolean;
        };

        /**
         * Module级别的Sync任务
         *
         * @since 2022/2/19
         */
        declare class SyncModule extends DefaultSyncTask {
            private readonly isFaMode;
            constructor(module: Module, taskName: string, isFaMode: boolean);
            registryAction: () => Function;
        }

        /**
         * Project级别的Sync任务
         *
         * @since 2022/2/19
         */
        declare class SyncProject extends DefaultSyncTask {
            constructor(project: Project, taskName: string);
            registryAction: () => Function;
        }

        export declare interface Target {
            getCurrentProduct: () => Product;
            getBuildTargetOutputPath: () => string;
            getTargetName: () => string;
            getBuildOption: () => BuildOption;
            getModulePathDetails: () => PathDetails;
        }

        declare interface TargetRegistry {
            registryTarget: (service: TargetTaskService) => void;
            getTarget: (moduleName: string, targetName?: string) => TargetTaskService | undefined;
        }

        declare interface TargetRuntimeOS {
            moduleName: string;
            targetName: string;
            productName: string;
            runtimeOS?: string;
        }

        declare interface TargetSourceSetModel extends SourceSetModel {
            /**
             * 获取Stage模型资源模型
             *
             * @return ModuleTargetRes
             */
            getModuleTargetRes: () => ModuleTargetRes;
        }

        /**
         * 以Target为维度创建不同的task，提供target相关的数据信息和管理
         *
         * @since 2022/8/11
         */
        declare class TargetTaskService {
            private targetData;
            private buildOption;
            private readonly _sdkInfo;
            private readonly moduleService;
            private readonly shouldBuildCmake;
            constructor(targetData: ModuleTargetData, moduleService: ModuleTaskService);
            refreshBuildOption(): void;
            buildTaskName(taskDetails: TaskDetails, targetName?: string): TaskDetails;
            getTargetData(): ModuleTargetData;
            getBuildOption(): BuildOpt;
            isByteCodeHar(): boolean;
            isCustomizedHar(): boolean;
            /**
             * 获取byteCodeHar真实值
             * useNormalizedOHMUrl=true
             *    byteCodeHar若无配置则默认为true
             * useNormalizedOHMUrl=false
             *    byteCodeHar若无配置则默认为false
             * 非上述默认情况则以实际配置值为准
             *
             * @param useNormalizedOHMUrl 使用新格式ohmurl 默认为false 需显示配置才可生效
             * @param byteCodeHar
             */
            getByteCodeHar(useNormalizedOHMUrl: boolean | undefined, byteCodeHar: boolean | undefined): boolean;
            /**
             * 获取noExternalImportByPath真实值
             * useNormalizedOHMUrl=true时
             *    noExternalImportByPath若无配置则默认为true
             * 非上述默认情况则以实际配置值为准
             */
            isNoExternalImportByPath(): boolean;
            /**
             * 判断是否为源码har
             */
            isSourceCodeHar(): boolean;
            isBundledDependencies(): boolean;
            getNativeLibOption(): NativeLib;
            /**
             * 提供当前target绝对路径化的workerConfig
             * @returns {string[]}
             */
            getWorkerConfig(): string[];
            /**
             * 获取模块级build-profile.json5中所有自定义buildProfileFields的变量
             */
            getBuildProfileFields(): object | undefined;
            /**
             * 获取模块target资源目录集合
             */
            getResourceDirs(): string[];
            /**
             *  相对路径转换为资源绝对路径并校验
             *
             * @param {string}  resourcesDirs 资源路径
             */
            private convertResourceAbsolutePath;
            getAnBuildMode(): AotCompileModeEnum;
            getApPath(): string | undefined;
            getApAbsolutePath(): string;
            getCustomTypes(): string[] | undefined;
            isDebug(): boolean;
            /**
             * 判断是否为开源/闭源
             * 1.混淆配置仅release生效
             * 2.debug模式下均为开源
             * 3.release模式下检查arkOptions?.obfuscation?.ruleOptions?.enable字段
             *    3.1.若enable配置为false或缺省,则不开启混淆为开源
             *    3.2.若enable配置为true,则开启混淆为闭源
             */
            isOpenSource(): boolean;
            getShouldBuildCmake(): boolean;
            /**
             * 判断构建模式是debug还是release
             */
            getBuildMode(): string;
            needPackBin(target: ModuleTargetData): boolean;
            getSdkInfo(): SdkInfo;
            getModuleService(): ModuleTaskService;
            /**
             * 获取卡片配置文件路径的数组
             * e.g. ./src/main/resources/base/profile/form_config.json
             * 1.默认在当前模块的资源目录中索引卡片配置文件
             * 2.如果是独立卡片包，则会合并使用方的module.json的extensionAbilities信息用于后续校验
             *
             * @param taskService
             * @returns 卡片配置文件路径的数组
             */
            static getFormJsonArr(taskService: TargetTaskService): string[];
            /**
             * 获取卡片配置文件路径的数组
             *
             * @returns 卡片配置文件路径的数组
             * @param targetModuleOptObj
             * @param targetResourcesPath
             * @param targetJsonPath
             */
            static getFormJsonArrByTargetResource(targetModuleOptObj: ModuleJson.ModuleOptObj, targetResourcesPath: string, targetJsonPath: string): string[];
            private static formJsonFileCheck;
            /**
             * 获取startup文件名
             */
            getAppStartupFileName(isFaMode: boolean): string | undefined;
            /**
             * 获取appStartup配置文件路径
             * @private
             */
            getAppStartupPath(isFaMode: boolean): string | undefined;
            /**
             * 获取指定根模块的shortcutsJson配置路径
             * @private
             * @param moduleModel
             */
            getShortcutsJsonPaths(moduleModel: ModuleModel | undefined): string[];
            /**
             * 获取shortcuts配置文件名
             * @param moduleModel
             * @private
             */
            getShortcutsJsonFileNames(moduleModel: ModuleModel | undefined): string[];
            /**
             * 处理能力元数据，提取快捷方式资源并添加到快捷方式列表中。
             *
             * @param abilities - 包含能力信息的数组，每个能力对象可能包含元数据。
             * @param shortcutsList - 用于存储提取的快捷方式资源的数组。
             */
            private handleAbilityMetadata;
            /**
             * 获取指定根模块的shareConfig配置路径
             * @private
             * @param moduleModel
             */
            getShareConfigJsonPath(moduleModel: ModuleModel | undefined): string | undefined;
            /**
             * 获取模块共享配置文件名
             * @param moduleModel
             * @private
             */
            getShareConfigJsonFileName(moduleModel: ModuleModel | undefined): string | undefined;
            /**
             * 根据target定制资源目录获取对应ShareConfigObjList
             * @param moduleModel
             * @private
             */
            getTargetShareConfigObjList(moduleModel: ModuleModel): any[] | undefined;
            /**
             * 获取指定根模块的routerMap配置路径
             * @private
             * @param moduleModel
             */
            getRouterMapJsonPath(moduleModel: ModuleModel | undefined): string | undefined;
            /**
             * 获取当前根模块的InsightIntentJson配置路径
             * 存在自定义多资源目录的时候拿第一个（与routerMap保持一致）,否则返回默认路径base/profile/insightIntent.json
             * @private
             */
            getInsightIntentJsonPath(): string;
            /**
             * 获取模块路由表配置文件名
             * @param moduleModel
             * @private
             */
            getRouterMapJsonFileName(moduleModel: ModuleModel | undefined): string | undefined;
            /**
             * 根据target定制资源目录获取对应routerMapObjList
             * @param moduleModel
             * @private
             */
            getTargetRouterMapObjList(moduleModel: ModuleModel): any[] | undefined;
            /**
             * 获取target定制资源base/profile下的目录地址
             */
            getTargetResourceBaseProfilePath(relativePath: string): string | undefined;
            /**
             * 获取模块对应pkgContextInfo
             * @param packageName 包名
             */
            getPkgContextInfo(packageName: string): any;
            /**
             * 获取原始srcEntry的绝对路径
             * srcEntry在编辑器中限制只能以./开头,即相对于module.json
             * @param originalSrcEntry
             * @param rootPath
             */
            getAbsoluteSrcEntryPath(originalSrcEntry: string, rootPath: string): string;
            /**
             * 是否开启har包去重功能
             * 1.deduplicateHar开关打开
             * 2.preview,ohosTest,localTest场景不开启
             */
            shouldEnableHarDeduplicate(): boolean;
            /**
             * 单独调试hsp的场景是否需要执行去重任务
             * 除了要满足shouldEnableHarDeduplicate()条件,调试hsp时是否真正执行去重任务还要看withDeduplicate参数，withDeduplicate参数是调试传过来的
             */
            private shouldDoDeduplicateTaskInDebuggingHsp;
            /**
             * 是否需要真正执行去重相关任务(去重任务已注册，但有些场景如单独调试hsp时不需要执行任务)
             */
            shouldDoDeduplicateTask(): boolean;
            /**
             * 判断当前target是不是ohosTest
             * @returns {boolean}
             * @protected
             */
            isOhosTest(): boolean;
            /**
             * 判断当前模块是不是集成态Hsp
             * @returns {boolean}
             * @protected
             */
            isIntegratedHsp(): boolean;
        }

        /**
         * 对外暴露的通过接口获取Task信息的接口
         */
        declare interface Task {
            /**
             * 任务名称，全局唯一
             */
            getName: () => string;
            /**
             * 当前Task依赖的Task列表
             * 前置依赖的tasks, 先执行前置依赖，再执行此task
             */
            getDependencies: () => string[];
            /**
             * 禁用任务
             *
             * @param enable
             */
            setEnable: (enable: boolean) => void;
            /**
             * beforeRun 先进后出
             *
             * @param fn
             */
            beforeRun: (fn: Function) => void;
            /**
             * afterRun 先进先出
             *
             * @param fn
             */
            afterRun: (fn: Function) => void;
            /** @internal */
            getNameInternal: () => string;
            /** @internal */
            getDependenciesInternal: () => string[];
            /** @internal */
            setEnableInternal: (enable: boolean) => void;
            /** @internal */
            beforeRunInternal: (fn: Function) => void;
            /** @internal */
            afterRunInternal: (fn: Function) => void;
        }

        /**
         * 定义Hvigor任务管理容器支持的方法，主要包括添加，删除，查找等
         *
         * @since 2022/4/24
         */
        declare interface TaskContainer {
            /**
             * 往容器中增加Task
             *
             * @param {Task} task
             */
            addTask(task: CoreTask): void;
            /**
             * 注册任务TaskCreation
             *
             * @param action
             */
            registerTask(action: TaskCreation): void;
            /**
             * 从容器中删除Task
             *
             * @param {string} taskName
             * @return {boolean}
             */
            deleteTask(taskName: string): boolean;
            /**
             * 从容器中查找Task
             *
             * @param {string} taskName
             * @returns {Task | undefined}
             */
            findTask(taskName: string): CoreTask | undefined;
            /**
             * 从容器中查找任务依赖
             *
             * @param {string} taskPath
             * @returns {string[]}
             */
            getTaskDepends(taskPath: string): string[];
            /**
             * 判断是否存在该task
             *
             * @param {string} taskName
             * @returns {boolean}
             */
            hasTask(taskName: string): boolean;
            /**
             * 获取容器中的所有Task
             *
             * @returns {Task[]}
             */
            getAllTasks(): CoreTask[];
            getTaskPaths(): string[];
            /**
             * 清理容器中所有Task
             */
            clearTasks(): void;
        }

        declare type TaskCreation = {
            provider: () => CoreTask;
            depends: string[];
            details: TaskDetails;
            dependsDefinedByUser: string[];
        };

        /**
         * 定义一个Task所需的基础属性信息
         *
         * @since 2022/5/30
         */
        declare interface TaskDetails {
            readonly name: string;
            readonly group?: string;
            readonly description?: string;
            readonly isEnabled?: boolean;
            [propName: string]: unknown;
        }

        /**
         * 用于保存Hvigor的任务依赖关系的一个DAG图，提供包括添加图中节点，节点之间关系，判断节点之间是否联通等方法
         * _out和_in都是一个MultiMap，其中key是当前节点的唯一标识，即Task的path，value的大小是当前节点的入度或出度
         * _out用来保存所有以当前节点为头节点的节点信息集合,对应节点的出度
         * _in用来保存所有以当前节点为尾节点的节点信息集合，对应节点的入度
         *
         * @since 2022/4/24
         */
        declare class TaskDirectedAcyclicGraph {
            private _out;
            private _in;
            /**
             * 添加一个图中的节点
             *
             * @param {string} nodeKey
             */
            addNode(nodeKey: string): void;
            /**
             * 添加两个节点之间的边,为了保证为一个有向无环图，故添加时需要判断两点之间是否已包含边
             *
             * @param {string} originKey
             * @param {string} targetKey
             * @returns {boolean}
             */
            addEdge(originKey: string, targetKey: string): boolean;
            private _hasEdge;
            /**
             * 删除图中节点,同时要删除关联的起始和结束节点
             *
             * @param {string} nodeKey
             */
            removeNode(nodeKey: string): void;
            /**
             * 清空DAG图
             */
            clear(): void;
            /**
             * 根据节点的key获取其子节点
             *
             * @param {string} nodeKey
             * @returns {Set<string>}
             */
            getChildren(nodeKey: string): Set<string>;
            /**
             * 根据节点的key获取其父节点
             *
             * @param {string} nodeKey
             * @return {Set<string>}
             */
            getParent(nodeKey: string): Set<string>;
            /**
             * 获取所有入度为0的起始节点
             *
             * @returns {Set<string>}
             */
            getAllStartNodes(): Set<string>;
            /**
             * 获取所有出度为0的叶子节点
             *
             * @returns {Set<string>}
             */
            getAllEndNodes(): Set<string>;
            /**
             * 检查是否有环
             */
            checkCircle(): {
                hasCircle: boolean;
                circlePath: string[];
            };
            private dfsCircleCheck;
            private findAllZeroEdgeNodes;
        }

        /**
         * 用于保存一些任务执行状态的信息
         *
         * @since 2022/9/1
         */
        declare class TaskExecuteStatus {
            private _state;
            private _taskBeginTime;
            private _workerTimePeriod;
            private _isUpToDate;
            unTrackStateReason: string | undefined;
            constructor();
            setState(state: number): void;
            getState(): number;
            getTaskBeginTime(): [number, number] | undefined;
            setIsUpToDate(upToDate: boolean): void;
            isUpToDate(): boolean;
            setWorkerTimePeriod(time: [number, number]): void;
            getWorkerTimePeriod(): [number, number][];
        }

        declare class TaskInput {
            private declareInputs;
            private declareInputFiles;
            /** @internal */
            constructor(declareInputs: Map<string, TaskInputValue>, declareInputFiles: FileSet);
            file(path: string): TaskInput;
            /** @internal */
            fileInternal(path: string): TaskInput;
            private _file;
            files(paths: string[]): TaskInput;
            /** @internal */
            filesInternal(paths: string[]): TaskInput;
            private _files;
            property(key: string, value: TaskInputValue): TaskInput;
            /** @internal */
            propertyInternal(key: string, value: TaskInputValue): TaskInput;
            private _property;
        }

        declare type TaskInputValue = number | string | boolean | string[] | number[] | boolean[];

        /**
         * 定义和提供Hvigor Node的管理任务相关的接口,包括注册,查询,创建模块间任务依赖等
         *
         * @since 2022/4/24
         */
        declare interface TaskManager {
            /**
             * 获取当前Node所有注册了的task
             *
             * @return {CoreTask[]}
             */
            getAllTasks(): CoreTask[];
            getTaskPaths(): string[];
            /**
             * 根据任务名获取当前模块中的task
             *
             * @param {string} name
             * @return {CoreTask | undefined}
             */
            getTaskByName(name: string): CoreTask | undefined;
            /**
             * 根据任务名获取当前模块中的taskCreationAction
             *
             * @param {string} name
             * @return {TaskCreation | undefined}
             */
            getTaskCAByName(name: string): TaskCreation | undefined;
            /**
             * 通过需要执行的Function和任务名注册到当前Node中
             * 可以通过传入一个TaskDetails类型的对象，直接对Task的基础信息进行赋值
             * eg:
             * project.task(()=>{
             *   // do something
             * },'Test Task')
             *
             * project.task(()=>{
             *   // do something
             * },{
             *   name:'Test Task',
             *   group:'Test Group',
             *   description:'This is a test task'
             * })
             *
             * @param {Function} fn Task的可执行function
             * @param {string|TaskDetails} taskInfo Task的描述信息
             * @return {CoreTask} 注册成功后返回的Task对象
             */
            task(fn: Function, taskInfo?: string | TaskDetails): CoreTask;
            /**
             * 直接通过Task对象注册任务到当前Node中
             *
             * @param {CoreTask} task 待注册的task对象
             * @return {CoreTask} 注册成功后返回的Task对象
             */
            registry(task: CoreTask): CoreTask;
            /**
             * 直接通过Task对象注册任务到当前Node中
             *
             * @param {CoreTask} task 待注册的task对象
             * @return {HvigorTaskNode} 注册成功后返回的Task对象
             */
            registerTask(task: HvigorTask): HvigorTask;
            /**
             * 根据任务名判断是否当前Node中是否存在该Task
             *
             * @param {string} name
             * @return {boolean} true|false
             */
            hasTask(name: string): boolean;
            getTaskDepends(task: string): string[];
            /**
             * 获取当前Node的Task管理容器
             *
             * @return {TaskContainer} task容器对象
             */
            getTaskContainer(): TaskContainer;
            /**
             * 获取当前Node的Task DAG图对象
             *
             * @return {TaskDirectedAcyclicGraph}
             */
            getTaskGraph(): TaskDirectedAcyclicGraph;
            /**
             * 清空当前Node的Task DAG图对象
             */
            clearTaskGraph(): void;
            /**
             * 同时注册多个originalTask依赖的task到Node中,并创建任务之间的依赖
             * 即不需要再依次再对每个depends task 单独注册到task容器中
             *
             * @param {CoreTask} originalTask 源task
             * @param {CoreTask[]} dependsOnTasks 依赖task
             */
            registryDependsOnTask(originalTask: CoreTask, ...dependsOnTasks: CoreTask[]): void;
        }

        declare class TaskOutput {
            private declareOutputFiles;
            constructor(declareOutputFiles: FileSet);
            file(path: string): TaskOutput;
            /** @internal */
            fileInternal(path: string): TaskOutput;
            private _file;
            files(paths: string[]): TaskOutput;
            /** @internal */
            filesInternal(paths: string[]): TaskOutput;
            private _files;
        }

        /**
         * 任务的pendingPromises，用于保存当前任务的promise
         *
         * @since 2023/12/14
         */
        declare class TaskPendingPromises {
            private promiseSet;
            /**
             * 给当前任务添加promise，可添加多个，只有当全部被添加的promise状态都变更为fulfilled，当前任务才算执行成功
             * 可以基于promisify来改造你的异步逻辑，并调用此方法加入promise，内部会检测promise的状态变更来调用相对应的逻辑
             * 同时，你也可以将worker和child_process进行promisify来提高并发处理能力
             *
             * const promise = new Promise((resolve, reject) => {
             *     const worker = new Worker(filename);
             *     worker.on('close', resolve);
             *     worker.on('error', reject);
             * });
             *
             * task.pendingPromises.add(promise);
             *
             * @param promise
             */
            add(promise: Promise<unknown>): void;
            /**
             * 获取当前任务的全部promise
             */
            get(): Promise<unknown>[];
            /**
             * 清空当前任务的promise
             */
            clear(): void;
        }

        /**
         * 任务流服务的基础类
         *
         * @since 2022/1/20
         */
        declare class TaskService {
            private readonly log;
            protected hvigorNode: HvigorCoreNode;
            protected readonly _projectModel: ProjectModel;
            private _moduleDependencyInfo;
            protected _dependencyManager: DependencyManager;
            protected _isFaMode: boolean;
            private _dependencyCache;
            constructor(node: HvigorCoreNode, projectModel: ProjectModel, dependencyManager: DependencyManager, isFaMode: boolean);
            getDependencyCache(): Map<DependencyCacheKey, Dependency[] | DependencyCacheValue>;
            initDependencyInfo(): void;
            isFaMode(): boolean;
            getNode(): HvigorCoreNode;
            getProjectModel(): ProjectModel;
            /**
             * 获取所有依赖的main对应文件的路径的集合
             * @returns {string[]}
             */
            getDependencyMainPaths(): string[];
            /**
             * 获取所有依赖在node_modules中路径的集合
             * @returns {string[]}
             */
            getDependencyRootPaths(): string[];
            /**
             * 获取不排除Hsp的间接依赖和DevDependencies的所有依赖
             */
            getAllModuleOrProjectDependencies(): Dependency[];
            /**
             * 获取不排除Hsp的间接依赖和DevDependencies的所有三方依赖
             */
            getAllOtherDependencies(): Dependency[];
            getDependencyName2RootPath(): any;
            /**
             * 获取所有har依赖
             * @returns {Dependency[]}
             */
            getHarDependencies(): Dependency[];
            /**
             * 获取远程har依赖
             */
            getRemoteHarDependencies(): Dependency[];
            /**
             * 获取所有hsp依赖
             * @returns {Dependency[]}
             */
            getHspDependencies(): Dependency[];
            /**
             * 获取所有依赖类型map
             */
            getAllDependencyType(): Map<string, DependencyType>;
            /**
             * 获取字节码Har对应的Hsp map: Map<dependencyKey, hspPkgName[]>
             */
            getByteCodeHar2Hsp(): Map<string, string[]>;
            /**
             * 递归获取依赖树中的所有hsp
             */
            getHspRecursion(deptName: string, allDep: Dependency[], tempMap?: Map<string, string[]>): string[];
            getHspOrByteCodeHarDependencies(): Dependency[];
            /**
             * 获取所有so依赖
             * @returns {Dependency[]}
             */
            getSODependencies(): Dependency[];
            /**
             * 获取所有ohpm npm依赖
             * @returns {Dependency[]}
             */
            getOtherDependencies(): Dependency[];
            /**
             * 获取所有其他依赖
             * @returns {Dependency[]}
             */
            getAllDependencies(): Dependency[];
            private excludeChildrenWhenInDevDependencies;
            getDirectPkgNodes(): ModulePkgNode[];
            /**
             * 获取当前模块的直接依赖
             * @returns {Dependency[]}
             */
            getDirectDependencies(): Dependency[];
            /**
             * 获取所有直接依赖子节点，包括devDependencies
             */
            getAllDirectPkgNodes(): ModulePkgNode[];
            /**
             * 获取所有直接依赖，包括devDependencies，工程级本地依赖
             */
            getAllDirectDependencies(): Dependency[];
            /**
             * 组建依赖树进行遍历收集，复用逻辑，调用_dependencyManager.collectFromTree
             * @param shouldTerminate 是否需要终止遍历，类型虽与_dependencyManager.collectFromTree一致，但返回值却被取反
             * @param shouldCollect 是否需要收集进最终的返回结果
             * @private
             */
            private collectFromTree;
            /**
             * 获取依赖链上的所有HSP，包括devDependencies，工程级本地HSP
             */
            getAllHspDependencies(): Dependency[];
            /**
             * 收集首层字节码HAR依赖，包括配置于devDependencies，工程级本地依赖的间接字节码HAR依赖
             * 只收集直接依赖中的字节码HAR，和被源码HAR依赖的字节码HAR
             * 1.HSP -> bytecodeHar，bytecodeHar不收集
             * 2.byteCodeHar -> dayjs，dayjs不收集
             * 3.byteCodeHar1 -> byteCodeHar2，byteCodeHar2不收集
             * 4.globalLocalHarDependency -> byteCodeHar，byteCodeHar收集
             */
            getRootByteCodeHarDependencies(): Dependency[];
            /**
             * 收集首层NPM三方包依赖，包括配置于devDependencies，工程级本地依赖的间接NPM三方包依赖
             * 只收集直接依赖中的NPM三方包，和被源码HAR依赖的NPM三方包
             * 1.HSP -> dayjs，dayjs不收集，被hsp依赖的，不收集
             * 2.byteCodeHar -> dayjs，dayjs不收集，被字节码HAR依赖的不收集
             * 3.dayjs -> otherNpmPackage，otherNpmPackage不收集
             * 4.globalLocalHarDependency -> dayjs，dayjs收集
             */
            getRootOtherDependencies(): Dependency[];
            /**
             * 收集首层HSP依赖，包括配置于devDependencies，工程级本地依赖
             * 1.HSP1 -> HSP2，HSP2不收集
             */
            getRootHspDependencies(): Dependency[];
            /**
             * 在目前的编译逻辑中，在编译期间rollup有可能需要对以下依赖进行编译阻断：
             * 1.NPM三方包（bundled字节码HAR）
             * 2.HSP（所有模块）
             * 3.字节码HAR（所有模块）
             * 所以，当前这个函数，收集依赖逻辑如下（依赖包括配置于devDependencies，工程级本地依赖）：
             * 1.bytecodeHar -> any，bytecodeHar收集，依赖any不收集
             * 2.sourcecodeHar1 -> sourcecodeHar2 -> dayjs -> any，sourcecodeHar1，sourcecodeHar2，dayjs收集，依赖any不收集
             * 3.HSP -> any，HSP收集，依赖any不收集
             * 4.sourcecodeHar1 -> sourcecodeHar2 -> bytecodeHar -> any，sourcecodeHar1，sourcecodeHar2，bytecodeHar收集，依赖any不收集
             * 简单点理解，就是，当某个依赖可能需要被编译阻断时，只收集自身，其依赖（直接/间接）都不收集。
             */
            getAffectsCompilationDependencies(): Dependency[];
            /**
             * 收集所有字节码HAR依赖，包括配置于devDependencies，工程级本地依赖
             */
            getAllByteCodeHarDependencies(): Dependency[];
            /**
             * 收集当前模块依赖链上的所有本地模块，包括devDependencies和工程级的本地依赖，被HSP阻断的不收集
             */
            getAllModuleDependencies(): Dependency[];
            /**
             * 获取所有hsp依赖的路径的集合
             * @returns {Dependency[]}
             */
            getHspDependencyPaths(): string[];
            /**
             * 获取所有本地鸿蒙依赖模块
             * @returns {Dependency[]}
             */
            getModuleDependencies(): Dependency[];
            /**
             * 获取所有本地鸿蒙依赖模块的路径的集合
             * @returns {Dependency[]}
             */
            getModuleDependenciesPaths(): string[];
            /**
             * 获取所有本地依赖har模块
             * @returns {[string, Dependency][]}
             */
            getHarModuleDependencies(): [string, Dependency][];
            /**
             * 获取所有本地依赖har模块返回Map
             * @returns {Map<string, [string, Dependency]>}
             */
            getHarModuleDependenciesWithRootPath(): Map<string, [string, Dependency]>;
            /**
             * 获取所有本地依赖har模块的名称
             * @returns {string[]}
             */
            getHarModuleDependencyNames(): string[];
            /**
             * 获取所有本地依赖har模块的路径
             * @returns {string[]}
             */
            getHarModuleDependencyPaths(): string[];
            /**
             * 获取所有本地依赖hsp模块
             * @returns {[string, Dependency][]}
             */
            getHspModuleDependencies(): [string, Dependency][];
            /**
             * 获取所有本地hsp依赖模块的名称
             * @returns {string[]}
             */
            getHspModuleDependencyNames(): string[];
            /**
             * 获取所有本地hsp依赖模块的路径
             * @returns {string[]}
             */
            getHspModuleDependencyPaths(): string[];
            /**
             * 获取除Dynamic所有本地hsp依赖模块的路径
             * @returns {string[]}
             */
            getHspModuleDependencyPathsWithOutDynamic(): string[];
            /**
             * 判断本模块是否有hsp依赖
             * @returns {[string, Dependency][]}
             */
            hasHspDependencies(): boolean;
            getDependencyInfo(): ModuleDependencyInfo;
            getOhpmDependencyInfo(): Record<string, OhpmDependencyInfo>;
            getOhpmRemoteHspAllInfo(service: ModuleTaskService | ProjectTaskService, currentProduct: string | undefined, isSigned: boolean): Record<string, DependRemoteHspInfo>;
            private setDependencyInfo;
            /**
             *   获取dependencies中的远程hsp依赖,对外暴露的api
             *
             * @param service
             * @param currentProduct
             * @param isSigned
             */
            getOhpmRemoteHspDependencies(service: ModuleTaskService | ProjectTaskService, currentProduct: string | undefined, isSigned: boolean): Record<string, OhpmDependencyInfo>;
            getRemoteHspDirName(dependencyRootPath: string): string | undefined;
        }

        /**
         * 任务状态
         *
         * @since 2022/8/12
         */
        declare enum TaskState {
            WAITING = 'waiting',
            RUNNING = 'running',
            END = 'end',
            REJECT = 'reject',
            ERROR = 'error'
        }

        /**
         * 任务控制块
         * 任务控制块与工作单元一一对应，使得外部可以通过任务控制块操纵工作单元
         *
         * @since 2022/8/26
         */
        declare interface TCB {
            /**
             * 获取id
             *
             * @returns {string} 任务控制块id
             */
            getId(): string;
            /**
             * 获取worker的id
             *
             * @returns {number | undefined} worker的id
             */
            getWorkerId(): number | undefined;
            /**
             * 获取提交时间
             *
             * @returns {number} 任务提交时间
             */
            getSubmitTime(): number;
            /**
             * 获取执行开始时间
             *
             * @returns {number | undefined} 任务执行开始时间
             */
            getStartTime(): number | undefined;
            /**
             * 获取执行结束时间
             *
             * @returns {number | undefined} 任务执行结束时间
             */
            getEndTime(): number | undefined;
            /**
             * 获取任务状态
             *
             * @returns {TaskState} 任务状态
             */
            getState(): TaskState;
            /**
             * 获取优先级
             *
             * @returns {Priority} 任务优先级
             */
            getPriority(): Priority;
            /**
             * 获取回调函数
             *
             * @returns {Function} 任务回调函数
             */
            getCallback(): Function;
            /**
             * 获取回调函数的输入
             *
             * @returns {unknown[]} 回调函数输入数据
             */
            getCallbackInput(): unknown[];
            /**
             * 设置优先级
             *
             * @param priority 待设置的优先级
             * @returns {boolean} 是否设置成功
             */
            setPriority(priority: Priority): boolean;
            /**
             * 设置回调函数
             *
             * @param callback 待设置的回调函数
             * @param callbackInput 待设置的回调函数的输入
             * @returns {boolean} 是否设置成功
             */
            setCallback(callback: Function, callbackInput?: unknown[]): boolean;
            /**
             * 获取任务路径
             *
             * @returns {string} 任务路径
             */
            getTaskPath(): string;
            /**
             * 获取任务名
             *
             * @returns {string} 任务名
             */
            getTaskName(): string;
            /**
             * 获取任务完整路径，包含任务路径和任务名
             *
             * @returns {string} 任务完整路径
             */
            getTaskCompletePath(): string;
            /**
             * 回调函数是否使用工作单元的返回值作为输入
             *
             * @returns {boolean} 判断结果
             */
            useReturnVal(): boolean;
        }

        declare interface TscConfig {
            targetESVersion?: string;
            maxFlowDepth?: number;
        }

        /**
         * 单元测试构建任务
         *
         * @since 2023/4/23
         */
        declare class UnitTestBuild extends AbstractModuleHookTask {
            constructor(moduleTaskService: ModuleTaskService, isFaMode: boolean);
            initTaskDepends(taskTargetService: TargetTaskService): void;
        }

        /**
         * 工作池代理器
         * 内置于task的对象，提供对工作池功能的间接访问
         *
         * @since 2022/8/31
         */
        declare class WorkerPoolDelegator {
            private workerPool;
            private static isActive;
            private static needWarmUp;
            constructor();
            warmUp(warmUpPath: string): void;
            submit(task: CoreTask, workPath: string, submitOption?: SubmitOption): TCB;
            terminate(): Promise<boolean>;
            getState(): PoolState;
            setState(state: PoolState): void;
            setRecycleInterval(recycleInterval: number): void;
            setMaxIdleTime(maxIdleTime: number): void;
            setErrorCallback(errorCallback: Function): void;
            getLog(type: LogType): Set<Log> | undefined;
            clearLog(type?: LogType): void;
            getMaxPoolNum(): number;
            getMinPoolNum(): number;
            setResident(resident: boolean): void;
            isActive(): boolean;
        }

        export { }
