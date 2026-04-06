export declare namespace ArkUIXConfigJson {
    interface ConfigObj {
        crossplatform: boolean;
        modules: string[];
        buildOption?: {
            resConfigs?: string[];
            ignoreCrossPlatform?: boolean;
        };
    }
}
