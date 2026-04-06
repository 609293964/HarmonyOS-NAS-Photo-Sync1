import { ArkUIXConfigJson } from '../../../options/configure/arkui-x-config-opt';
export interface CrossplatformInterface {
    /**
     * 对外暴露判断当前工程是否为跨平台Arkui-x的工程
     */
    isCrossplatformProject(): boolean;
    /**
     * 获取Arkui-x工程配置文件arkui-x-config.json5路径
     */
    getArkUIXConfigJsonPath(): string;
    /**
     * 获取Arkui-x工程配置文件arkui-x-config.json5反序列化的对象
     */
    getArkUIXConfigJsonObj(): ArkUIXConfigJson.ConfigObj | undefined;
}
