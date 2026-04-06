/**
 * 在 ohos-test-coverage 场景用测试框架覆盖率生成的 sourceMap 替换 sdk 生成的 sourceMaps.map 文件内容。
 * 因为覆盖率场景 rollup 生成的 sourceMap是不对的，测试框架覆盖率自己生成的 sourceMap 是对的。
 *
 * @param defaultSourceMapPath 原始的sourceMap全路径
 * @param coverageSourceMapPath 测试框架覆盖率生成的sourceMap全路径
 */
export declare function overWriteSourceMap(defaultSourceMapPath: string, coverageSourceMapPath: string): Promise<void>;
