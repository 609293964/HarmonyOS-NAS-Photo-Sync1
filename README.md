# HarmonyOS NAS Photo Sync

基于 **HarmonyOS 6.0.2 (API 22)** 的原生 ArkTS 应用，用于将拍摄的照片通过 **WebDAV** 自动上传到 NAS，并在应用内浏览 NAS 目录中的图片文件。

## 功能概览

- 拍照后自动上传到 NAS
- 浏览 NAS 目录中的文件
- 缩略图缓存与大图预览
- 长按删除 NAS 上的文件
- 可选“上传成功后自动尝试删除系统相册中的新照片”

## 技术栈

- ArkTS / ArkUI
- Stage Model
- HarmonyOS 6.0.2 (API 22)
- Hvigor 6.22.4
- WebDAV: `PROPFIND` + `PUT`

## 当前架构

核心业务几乎都集中在 [entry/src/main/ets/pages/Index.ets](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/src/main/ets/pages/Index.ets)：

- `AppStorageHelper`: 本地配置持久化
- `NasConfig`: 运行时连接配置
- `ThumbnailCacheService`: 缩略图缓存
- `RawHttpClient`: 基于 `TCPSocket` 的自定义 WebDAV `PROPFIND`
- `WebDavUploadService`: 标准 HTTP `PUT` 上传
- `WebDavListService`: NAS 文件列表与删除
- `CameraService`: 系统拍照结果接入与缓存文件生成
- `Index` 组件: 页面、设置、上传和删除流程

应用入口：

- [entry/src/main/ets/entryability/EntryAbility.ts](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/src/main/ets/entryability/EntryAbility.ts)
- [entry/src/main/module.json5](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/src/main/module.json5)

## NAS 配置格式

应用使用的是 **WebDAV**，不是 SMB 路径。

正确填写示例：

- 主机地址: `192.168.100.108`
- 端口: `5005` 或 `5006`
- WebDAV 路径: `/240/photo/cat/`
- 用户名: `momo`
- 密码: 你的 WebDAV 密码

不要填写：

- `\\192.168.100.108\240\photo\cat`

## 权限

当前模块声明了以下权限：

- `ohos.permission.CAMERA`
- `ohos.permission.INTERNET`
- `ohos.permission.GET_NETWORK_INFO`
- `ohos.permission.READ_IMAGEVIDEO`
- `ohos.permission.WRITE_IMAGEVIDEO`

说明：

- `CAMERA` 用于拍照
- `READ/WRITE_IMAGEVIDEO` 主要用于读取系统拍照结果，以及在用户允许后尝试删除系统相册中的照片资源

## 拍照与删除行为说明

当前实现遵循 HarmonyOS 的媒体资源边界：

1. 调用系统拍照能力获取照片资源
2. 将结果复制到应用缓存目录
3. 上传 NAS
4. 删除应用缓存文件
5. 如果“自动删除相册照片”开关已打开，则尝试调用官方媒体库删除接口

重要说明：

- 应用可以申请权限删除系统相册照片
- 但不能绕过系统权限/系统确认流程
- HarmonyOS 媒体库删除语义通常是“移入回收站”，不是无提示永久抹除

## 已知系统边界

- 某些设备上，系统相机 / 媒体库 / 图形栈会打印框架级日志，例如：
  - `Modal is not destroyed after UEC is destroyed`
  - `PARAM_WATCHER`
  - `RSUIContext is null`
- 这类日志通常属于系统层噪声，只要拍照、上传、删除流程正常，一般不视为业务错误

## 构建与运行

推荐使用 **DevEco Studio**：

1. 打开项目
2. 等待索引完成
3. 在 DevEco Studio 中配置签名，或选择自动生成签名
4. `Build > Clean Project`
5. `Build > Rebuild Project`
6. 真机运行

## 签名与安全

交付前已经做了以下处理：

- 移除了本机 `.ohos` 签名材料路径
- 清空了 `build-profile.json5` 中的本地签名密码字段

接手者需要在本机重新配置签名：

- [build-profile.json5](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/build-profile.json5)
- [entry/signing-configs.json5](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/signing-configs.json5)

## GitHub 交付清理

当前仓库已经补充：

- [.gitignore](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/.gitignore)

并已清理这类不适合上 GitHub 的内容：

- `.hvigor/`
- `.idea/`
- `entry/build/`
- `local.properties`
- 本地 `openharmony-toolchains-fixed` 副本
- 未接入的 `common` 模块
- 未使用的 `ImmersiveUtils.ets`
- 未使用的 `local-hvigor-plugin`

## 仍建议保留的辅助脚本

这几个脚本和 DevEco / SDK 兼容问题有关，建议保留：

- [fix-resource-pack-error.bat](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/fix-resource-pack-error.bat)
- [fix-resource-pack-error.ps1](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/fix-resource-pack-error.ps1)
- [fix-sdk-id-defined-order.bat](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/fix-sdk-id-defined-order.bat)
- [fix-sdk-id-defined-order.ps1](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/fix-sdk-id-defined-order.ps1)

## 交接建议

建议接手人优先关注：

- [entry/src/main/ets/pages/Index.ets](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/src/main/ets/pages/Index.ets)
- [entry/src/main/module.json5](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/entry/src/main/module.json5)
- [build-profile.json5](/C:/Users/lishi/Desktop/0402/HarmonyOS-NAS-Photo-Sync/build-profile.json5)

交接后的第一轮验证建议：

1. 配置签名
2. 校验 WebDAV 连通性
3. 拍照上传一张图片
4. 验证缓存文件是否删除
5. 验证“自动删除相册照片”开关是否符合预期

## 代码审查结论摘要

基于当前代码和本机 HarmonyOS SDK 类型定义，已处理的重点问题包括：

- 修复 WebDAV 上传误传 base64 文本
- 修复本地文件复制 offset 错误
- 去掉仓库中的真实 NAS 默认凭据
- 修复设置页密码框错误回填星号的问题
- 补充相机和媒体库权限申请流程
- 清理未接入模块与本机构建产物

剩余风险主要在系统层而不是业务层：

- 系统相机 / 媒体库相关日志噪声
- 不同设备对系统照片删除的交互与权限行为可能略有差异
- `Index.ets` 仍然偏大，后续可继续拆分模块

## License

ISC
