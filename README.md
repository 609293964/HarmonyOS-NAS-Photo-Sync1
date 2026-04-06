# NAS Photo Sync - HarmonyOS 应用项目

## 项目概述

基于 **HarmonyOS 6.0.2 (API 22)** 的原生 ArkTS 应用，通过 **WebDAV 协议**实现手机拍照后自动同步照片到飞牛（fnOS）NAS 服务器的完整工作流。

### 核心功能

- **📸 拍照上传**：调用系统相机拍照 → 确认上传 → WebDAV PUT 上传至 NAS → 自动删除本地副本
- **📂 文件浏览**：查看 NAS WebDAV 目录中的已同步文件，支持网格/列表视图切换
- **🖼️ 图片预览**：支持缩略图缓存和全屏图片查看
- **⚙️ 设置管理**：可视化配置 NAS 连接参数、认证信息和自动上传选项
- **🗑️ 文件删除**：长按文件可删除 NAS 上的文件

## 技术栈

| 项目 | 版本 |
|------|------|
| 开发语言 | ArkTS (TypeScript 严格模式) |
| HarmonyOS | 6.0.2 (API 22) |
| 构建工具 | Hvigor 6.22.4 |
| 模型架构 | Stage Model（单 entry HAP） |

## 项目结构

```
HarmonyOS-NAS-Photo-Sync/
├── build.bat                     # 基础编译脚本
├── fix-and-build.bat             # 补丁+编译脚本
├── patch-and-build.bat           # 补丁+编译脚本（自动打补丁）
├── clean-and-build.bat           # 清理+编译脚本
├── local.properties              # IDE SDK 路径配置
├── build-profile.json5           # 全局构建配置
├── hvigor-config.json5           # Hvigor 插件配置
├── hvigorfile.ts                 # 根构建入口
├── oh-package.json5              # 包管理配置
├── package.json                  # npm 配置
│
├── AppScope/                     # 应用全局资源
│   ├── app.json5                 # 应用配置
│   └── resources/base/
│       ├── element/string.json   # 字符串资源
│       └── media/icon.png        # 应用图标
│
└── entry/                        # 主模块（HAP 入口）
    ├── src/main/
    │   ├── module.json5          # 模块配置（INTERNET + GET_NETWORK_INFO）
    │   └── ets/pages/
    │       └── Index.ets         # 主页面（整合所有功能）
    ├── resources/base/           # 模块资源
    │   ├── element/              # 字符串、颜色等资源
    │   ├── media/                # 图标资源
    │   └── profile/              # 配置文件
    ├── build-profile.json5       # 模块构建配置
    └── oh-package.json5          # 模块依赖配置
```

## 功能详解

### 1. 拍照上传流程

```
点击"拍照"按钮
  → PhotoViewPicker 系统选择器（无需 CAMERA 权限）
  → 用户选图后复制到应用临时目录
  → Base64 编码 → WebDAV PUT 上传至 NAS
  → 成功 → 删除本地文件 → Toast 提示 + 刷新列表
  → 失败 → 显示错误信息
```

### 2. WebDAV 上传服务（WebDavUploadService）

- **协议**: HTTP PUT（标准方法）
- **目标地址**: `http://<NAS_HOST>:<PORT><WEBDAV_PATH>/<filename>`
- **认证方式**: HTTP Basic Auth（Base64 编码头）
- **安全措施**:
  - `sanitizeFileName()` — 路径遍历防护
  - 3 次自动重试 + 固定延迟（2s 间隔）
  - 30s 连接/读取超时
  - httpRequest 可空类型 + destroy 后置 null（防止悬空指针）

### 3. WebDAV 文件列表服务（WebDavListService）

- **协议**: HTTP PROPFIND（WebDAV 自定义方法）
- **实现方式**: **RawHttpClient**（基于 TCPSocket 手动构造 HTTP 请求）
- **原因**: HarmonyOS `@ohos.net.http` 不支持自定义 HTTP 方法（如 PROPFIND）
- **请求体**: XML PROPFIND（`<d:propfind><d:allprop/></d:propfind>`，Depth: 1）
- **响应解析**: 207 Multi-Status XML（支持大写/小写 DAV 命名空间前缀）

#### RawHttpClient 工作原理

```
RawHttpClient.request('PROPFIND', url, headers, body)
  ↓
socket.constructTCPSocketInstance() 创建 TCP Socket
  ↓
tcpSocket.connect({ address: { host, port }, timeout: 30000 })
  ↓
手动构造 HTTP/1.1 请求报文：
  PROPFIND /path HTTP/1.1\r\n
  Host: host:port\r\n
  Authorization: Basic xxx\r\n
  Content-Type: application/xml\r\n
  ...
  ↓
tcpSocket.send({ data: rawRequest })
  ↓
监听 'message' 事件接收响应数据
  ↓
按 Content-Length 或连接关闭判断接收完成
  ↓
parseRawResponse() 解析状态行 + 响应头 + 响应体
  ↓
返回 RawHttpResponse { statusCode, headers, body }
```

### 4. 缩略图缓存服务（ThumbnailCacheService）

- **缓存策略**: 本地文件系统缓存（应用 cacheDir/thumbnails/）
- **支持的格式**: jpg, jpeg, png, gif, webp, bmp, heic, heif
- **大小限制**: 单个文件最大 10MB
- **性能优化**:
  - 预加载机制（最多 20 个缩略图）
  - 失败记录（避免重复尝试失败的文件）
  - 缓存命中检测

### 5. 错误处理机制

| 场景 | 处理方式 |
|------|----------|
| NAS 不可达 / 无响应 | Toast 提示 + 返回空列表 |
| 认证失败 (401) | 抛出 "认证失败，请检查用户名密码" |
| 路径不存在 (404) | 抛出 "路径不存在" |
| 服务器错误 (5xx) | 抛出具体 HTTP 错误码 |
| 拍照失败 | Toast "拍照失败" + loading 重置 |
| 上传失败 | 3 次重试后抛出异常 + Toast 提示 |
| TCP 连接超时 | 30s 超时后 reject |

## NAS 配置示例（飞牛 fnOS WebDAV）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| NAS 类型 | 飞牛 fnOS | 支持 WebDAV 协议的 NAS 均可 |
| 主机地址 | 192.168.100.108 | NAS 的 IP 地址或域名 |
| WebDAV 端口 | 5005 | WebDAV 服务端口 |
| WebDAV 路径 | `/240/photo/cat/` | 照片存储路径 |
| 用户名 | momo | WebDAV 认证用户名 |
| 密码 | ******** | WebDAV 认证密码 |
| 最大重试次数 | 3 次 | 网络请求自动重试次数 |
| 重试间隔 | 2000 ms | 重试等待时间 |
| 超时时间 | 30000 ms | 网络请求超时时间 |

## 权限说明

仅声明以下 **normal 级别**权限（无需用户授权）：

```json5
{
  "module": {
    "requestPermissions": [
      { "name": "ohos.permission.INTERNET" },
      { "name": "ohos.permission.GET_NETWORK_INFO" }
    ]
  }
}
```

> **注意**：使用 PhotoViewPicker 系统选择器代替原生相机 API，因此不需要 CAMERA、READ_IMAGEVIDEO、WRITE_IMAGEVIDEO 等敏感权限。

## 编译运行

### 方式一：DevEco Studio IDE（推荐）

1. 打开 DevEco Studio → File → Open → 选择本项目目录
2. 等待项目索引和依赖解析完成
3. 菜单 File → Project Structure → Signing Configs → 选择 **Automatically generate signature**
4. 点击工具栏 **▶ Run** 或快捷键 **Shift+F10**

IDE 自动处理：签名 → 编译 → 安装到设备。

### 方式二：命令行编译

CLI 编译需要先对 DevEco Studio 安装目录的 hvigor 插件打补丁（修复版本格式兼容性问题），然后执行：

```bash
# 使用补丁+编译脚本（需要管理员权限，UAC 弹窗请点击"是"）
patch-and-build.bat
```

> **CLI 编译前提条件**：
> - DevEco Studio 已安装（用于提供 hvigor 和 SDK）
> - 管理员权限（用于向安装目录写入补丁文件）

## 架构设计决策

| 决策 | 原因 |
|------|------|
| 业务代码内联到 Index.ets | ArkTS/Rollup 不支持 CLI 构建中的相对模块导入 |
| CameraService.copyToLocal 改为 static 方法 | 普通 class 实例中 getContext(this) 不可靠，由 @Entry 组件传入 context |
| httpRequest 类型设为 \| null | 避免 destroy 后悬空指针，ArkTS 严格模式禁止非空断言 ! |
| 自定义 base64Encode() | ArkTS 运行时无 btoa() 内置函数 |
| PROPFIND 用 TCPSocket 而非 http.request | HarmonyOS http 模块不支持自定义 HTTP 方法 |
| PUT 上传仍用 http.request | PUT 是标准 HTTP 方法，不受限制 |
| Tabs 整合所有页面 | 减少页面跳转，提升用户体验，降低代码复杂度 |

## 代码优化记录（2026-04-06）

### 清理内容

✅ **移除临时调试脚本**（32 个文件）
- 删除所有 `.ps1` 和 `.bat` 调试脚本
- 保留原始项目必需的 4 个构建脚本

✅ **移除冗余页面**
- 删除 `SettingsPage.ets`（功能已整合到 Index.ets）
- 删除 `FileListPage.ets`（功能已整合到 Index.ets）
- 更新 `main_pages.json` 路由配置

✅ **代码质量优化**
- 移除未使用的 `router` 导入
- 修复 `showConfirmDialog` 未定义变量引用 bug
- 统一使用 Tabs 组件管理所有功能模块

### 性能优化建议（未来改进方向）

- [ ] 实现缩略图并发下载（Promise.all 替代序列化 await）
- [ ] 添加 LRU 缓存策略防止内存溢出
- [ ] 支持动态超时时间配置
- [ ] 图片懒加载和资源释放优化
- [ ] 代码模块化拆分（将 Index.ets 按功能拆分为独立模块）

## 开发日志

- **2026-04-06**: 全面项目清理与优化
  - 移除 32+ 个临时调试文件
  - 删除 2 个冗余页面组件
  - 修复代码质量问题
  - 更新项目文档

- **历史版本更新**:
  - API 14 → 升级至 **API 22 (HarmonyOS 6.0.2)**
  - Hvigor 5.0.0 → 升级至 **6.22.4**
  - 全面代码审计修复 22 项问题（安全性/性能/类型安全）
  - 系统性清理冗余文件，项目体积减少约 60%
  - 移除 common HSP 模块（zombie 模块导致 deviceType empty 错误）
  - 从模拟 HTTP API 迁移至 **真实 WebDAV 协议**（PROPFIND + PUT）
  - 实现 **RawHttpClient**（基于 TCPSocket）绕过 HarmonyOS http 方法限制
  - 修复 ArkTS 严格模式全部编译错误

## 已知问题与解决方案

### 1. DevEco Studio id_defined.json 重复 ID 错误

**问题**: 编译时出现 `The names 'ohos_id_color_foreground' and 'ohos_id_color_foreground' in the id_defined.json file define the same ID` 错误。

**原因**: 这是 DevEco Studio 6.0.2 / hvigor 资源编译链路的已知兼容问题。`restool.exe` 走的是 `openharmony\toolchains`，但 hvigor 生成的 `resConfig.json` 又额外注入了 `hms\toolchains\id_defined.json`，导致系统资源 ID 被重复加载。

**解决方案**:
1. 关闭 DevEco Studio IDE
2. 在项目根目录运行 `fix-resource-pack-error.bat`
3. 重新打开 IDE，执行 `Build > Clean Project`
4. 再执行 `Build > Rebuild Project`

**说明**:
- 这个脚本不会修改业务代码，只会补丁当前用户目录下的 `.hvigor\project_caches\...\@ohos\hvigor-ohos-plugin`
- 如果你清理了 `.hvigor` 缓存、升级了 DevEco Studio，或者重新同步后问题再次出现，重新运行一次脚本即可

### 2. OpenHarmony id_defined.json 顺序错乱

**问题**: 编译时出现 `The order value '2027' in the id_defined.json file does not match the record element sequence '2026'` 一类错误。

**原因**: DevEco Studio SDK 自带的 `C:\Program Files\Huawei\DevEco Studio\sdk\default\openharmony\toolchains\id_defined.json` 中，部分 `record[].order` 没有和真实数组下标保持一致。

**解决方案**:
1. 关闭 DevEco Studio IDE
2. 运行 `fix-sdk-id-defined-order.bat`
3. 重新打开 IDE 并执行 `Build > Rebuild Project`

**说明**:
- 脚本会先自动备份原始 `id_defined.json`
- 如果有权限，它会直接把每条记录的 `order` 重写为它当前所在的实际序号
- 如果没有权限写入 `Program Files`，它会自动在项目内生成一份修正后的本地 `toolchains`，并补丁 hvigor 让构建改用这份本地 `restool`
- 如果后续又遇到 `CompileResource` 的系统资源冲突，再运行 `fix-resource-pack-error.bat`

## 许可证

ISC License

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 联系方式

如有问题或建议，欢迎通过 GitHub Issues 反馈。
