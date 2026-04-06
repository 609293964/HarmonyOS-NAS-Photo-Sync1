/**
 * 公开的sdkInfo信息 定义类型
 */
export interface SdkDetails {
    isOhos(): boolean;
    getSdkDir(): string;
    getSdkVersion(): number;
    getEtsComponentVersion(): string;
    getEtsComponentReleaseType(): string;
}
