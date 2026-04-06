import fs from '@ohos.file.fs';
import http from '@ohos.net.http';
import socket from '@ohos.net.socket';
import connection from '@ohos.net.connection';
import hilog from '@ohos.hilog';
import promptAction from '@ohos.promptAction';
import preferences from '@ohos.data.preferences';
import common from '@ohos.app.ability.common';
import window from '@ohos.window';
import cameraPicker from '@ohos.multimedia.cameraPicker';
import camera from '@ohos.multimedia.camera';
import photoAccessHelper from '@ohos.file.photoAccessHelper';

const TAG: string = 'IndexPage';

class NasStoredConfig {
  host: string = '';
  port: number = 5005;
  path: string = '/photo/';
  user: string = '';
  pass: string = '';
  auto_upload: boolean = false;

  constructor(host: string = '', port: number = 5005, path: string = '/photo/', user: string = '', pass: string = '', autoUpload: boolean = false) {
    this.host = host;
    this.port = port;
    this.path = path;
    this.user = user;
    this.pass = pass;
    this.auto_upload = autoUpload;
  }
}

const DEFAULT_NAS_CONFIG: NasStoredConfig = new NasStoredConfig();

export interface NasFile {
  name: string;
  isDirectory: boolean;
  size: number;
}

class HttpHeader {
  name: string = '';
  value: string = '';

  constructor(name: string = '', value: string = '') {
    this.name = name;
    this.value = value;
  }
}

class HttpHeaders {
  private items: Array<HttpHeader> = [];

  set(name: string, value: string): void {
    const normalizedName: string = name.toLowerCase();
    for (let i: number = 0; i < this.items.length; i++) {
      if (this.items[i].name.toLowerCase() === normalizedName) {
        this.items[i].name = name;
        this.items[i].value = value;
        return;
      }
    }
    this.items.push(new HttpHeader(name, value));
  }

  get(name: string): string {
    const normalizedName: string = name.toLowerCase();
    for (let i: number = 0; i < this.items.length; i++) {
      if (this.items[i].name.toLowerCase() === normalizedName) {
        return this.items[i].value;
      }
    }
    return '';
  }

  forEach(callback: (header: HttpHeader) => void): void {
    for (let i: number = 0; i < this.items.length; i++) {
      callback(this.items[i]);
    }
  }
}

class CapturedPhotoResult {
  localPath: string = '';
  assetUri: string = '';

  constructor(localPath: string = '', assetUri: string = '') {
    this.localPath = localPath;
    this.assetUri = assetUri;
  }
}

function normalizeWebDavPath(path: string): string {
  const trimmedPath: string = path.trim();
  if (trimmedPath === '') {
    return DEFAULT_NAS_CONFIG.path;
  }

  let normalizedPath: string = trimmedPath;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  if (!normalizedPath.endsWith('/')) {
    normalizedPath += '/';
  }
  return normalizedPath;
}

export class AppStorageHelper {
  static async saveConfig(ctx: common.Context, host: string, port: number, path: string, user: string, pass: string, autoUpload: boolean): Promise<void> {
    try {
      const pref = await preferences.getPreferences(ctx, 'nas_config');
      await pref.put('webdav_host', host.trim());
      await pref.put('webdav_port', port);
      await pref.put('webdav_path', normalizeWebDavPath(path));
      await pref.put('webdav_user', user.trim());
      await pref.put('webdav_pass', pass);
      await pref.put('auto_upload', autoUpload);
      await pref.flush();
      hilog.info(0x0000, 'Config', '%{public}s', '配置已保存');
    } catch {
      hilog.error(0x0000, 'Config', '%{public}s', '保存配置失败');
    }
  }

  static async loadConfig(ctx: common.Context): Promise<NasStoredConfig> {
    try {
      const pref = await preferences.getPreferences(ctx, 'nas_config');
      return new NasStoredConfig(
        ((await pref.get('webdav_host', DEFAULT_NAS_CONFIG.host)) as string).trim(),
        (await pref.get('webdav_port', DEFAULT_NAS_CONFIG.port)) as number,
        normalizeWebDavPath((await pref.get('webdav_path', DEFAULT_NAS_CONFIG.path)) as string),
        ((await pref.get('webdav_user', DEFAULT_NAS_CONFIG.user)) as string).trim(),
        (await pref.get('webdav_pass', DEFAULT_NAS_CONFIG.pass)) as string,
        (await pref.get('auto_upload', DEFAULT_NAS_CONFIG.auto_upload)) as boolean
      );
    } catch {
      return new NasStoredConfig(
        DEFAULT_NAS_CONFIG.host,
        DEFAULT_NAS_CONFIG.port,
        DEFAULT_NAS_CONFIG.path,
        DEFAULT_NAS_CONFIG.user,
        DEFAULT_NAS_CONFIG.pass,
        DEFAULT_NAS_CONFIG.auto_upload
      );
    }
  }

  static async saveAutoUpload(ctx: common.Context, autoUpload: boolean): Promise<void> {
    try {
      const pref = await preferences.getPreferences(ctx, 'nas_config');
      await pref.put('auto_upload', autoUpload);
      await pref.flush();
    } catch {}
  }

  static async loadAutoUpload(ctx: common.Context): Promise<boolean> {
    try {
      const pref = await preferences.getPreferences(ctx, 'nas_config');
      return (await pref.get('auto_upload', false)) as boolean;
    } catch { return false; }
  }
}

export class NasConfig {
  static WEBDAV_HOST: string = '';
  static WEBDAV_PORT: number = 5005;
  static WEBDAV_PATH: string = '/photo/';
  static USERNAME: string = '';
  static PASSWORD: string = '';
  static readonly MAX_RETRY_COUNT: number = 3;
  static readonly RETRY_DELAY_MS: number = 2000;
  static readonly TIMEOUT_MS: number = 30000;

  static async initFromStorage(ctx: common.Context): Promise<void> {
    const cfg = await AppStorageHelper.loadConfig(ctx);
    NasConfig.applyConfig(cfg);
  }

  static applyConfig(cfg: NasStoredConfig): void {
    NasConfig.WEBDAV_HOST = cfg.host.trim();
    NasConfig.WEBDAV_PORT = cfg.port;
    NasConfig.WEBDAV_PATH = normalizeWebDavPath(cfg.path);
    NasConfig.USERNAME = cfg.user.trim();
    NasConfig.PASSWORD = cfg.pass;
  }

  static isConfigured(): boolean {
    return NasConfig.WEBDAV_HOST !== '' && NasConfig.USERNAME !== '' && NasConfig.PASSWORD !== '';
  }

  static getBaseUrl(): string {
    return 'http://' + NasConfig.WEBDAV_HOST + ':' + String(NasConfig.WEBDAV_PORT);
  }

  static getListUrl(): string { return NasConfig.getBaseUrl() + NasConfig.WEBDAV_PATH; }
  static getFileUrl(fileName: string): string { return NasConfig.getBaseUrl() + NasConfig.WEBDAV_PATH + encodeURIComponent(fileName); }
  static getUploadUrl(fileName: string): string { return NasConfig.getBaseUrl() + NasConfig.WEBDAV_PATH + encodeURIComponent(fileName); }
}

function base64Encode(str: string): string {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result: string = '';
  let i: number = 0;
  while (i < str.length) {
    const a: number = str.charCodeAt(i++);
    const b: number = i < str.length ? str.charCodeAt(i++) : 0;
    const c: number = i < str.length ? str.charCodeAt(i++) : 0;
    const triplet: number = (a << 16) | (b << 8) | c;
    result += chars[(triplet >> 18) & 0x3F] + chars[(triplet >> 12) & 0x3F] + chars[(triplet >> 6) & 0x3F] + chars[triplet & 0x3F];
  }
  const padLen: number = (3 - (str.length % 3)) % 3;
  if (padLen > 0) { result = result.substring(0, result.length - padLen); for (let p: number = 0; p < padLen; p++) { result += '='; } }
  return result;
}

export function sanitizeFileName(fileName: string): string { return fileName.replace(/[\\/:*?"<>|]/g, '_'); }
function getAuthHeader(): string { return 'Basic ' + base64Encode(NasConfig.USERNAME + ':' + NasConfig.PASSWORD); }
function stringToArrayBuffer(str: string): ArrayBuffer {
  const bytes: Uint8Array = new Uint8Array(str.length);
  for (let i: number = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i) & 0xFF;
  }
  return bytes.buffer as ArrayBuffer;
}

function safeWriteFile(localPath: string, data: ArrayBuffer): void {
  let file: fs.File | null = null;
  try {
    file = fs.openSync(localPath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
    fs.writeSync(file.fd, data);
  } finally {
    if (file) {
      try { fs.closeSync(file); } catch (e) { hilog.warn(0x0000, TAG, '%{public}s', '关闭文件异常'); }
    }
  }
}

export class ThumbnailCacheService {
  private cacheDir: string = '';
  private static instance: ThumbnailCacheService | null = null;
  static readonly SUPPORTED_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif'];
  static readonly MAX_THUMBNAIL_SIZE: number = 10 * 1024 * 1024;

  private constructor() {}

  async initCache(ctx: common.Context): Promise<void> {
    try {
      this.initCacheDirectory(ctx);
      hilog.info(0x0000, TAG, '%{public}s', '缓存目录初始化成功: ' + this.cacheDir);

      if (fs.accessSync(this.cacheDir)) {
        hilog.info(0x0000, TAG, '%{public}s', '缓存目录存在且可访问');
      } else {
        hilog.warn(0x0000, TAG, '%{public}s', '缓存目录不存在，将在下载时自动创建');
      }
    } catch (e) {
      hilog.error(0x0000, TAG, '%{public}s', '缓存目录初始化失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  static isImageFile(fileName: string): boolean {
    const ext: string = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    return ThumbnailCacheService.SUPPORTED_EXTENSIONS.includes(ext);
  }

  private initCacheDirectory(ctx: common.Context): void {
    try {
      const baseCacheDir: string = ctx.cacheDir;
      this.cacheDir = baseCacheDir + '/thumbnails/';

      hilog.info(0x0000, 'ThumbCache', '%{public}s', '基础缓存目录: ' + baseCacheDir);

      try {
        if (!fs.accessSync(baseCacheDir)) {
          fs.mkdirSync(baseCacheDir);
          hilog.info(0x0000, 'ThumbCache', '%{public}s', '✅ 创建基础缓存目录成功');
        }
      } catch (mkdirErr) {
        hilog.warn(0x0000, 'ThumbCache', '%{public}s', '⚠️ 基础目录可能已存在: ' + (mkdirErr instanceof Error ? mkdirErr.message : String(mkdirErr)));
      }

      try {
        if (!fs.accessSync(this.cacheDir)) {
          fs.mkdirSync(this.cacheDir);
          hilog.info(0x0000, 'ThumbCache', '%{public}s', '✅ 创建缩略图缓存目录成功');
        }
      } catch (thumbMkdirErr) {
        hilog.warn(0x0000, 'ThumbCache', '%{public}s', '⚠️ 缩略图目录可能已存在: ' + (thumbMkdirErr instanceof Error ? thumbMkdirErr.message : String(thumbMkdirErr)));
      }

      hilog.info(0x0000, 'ThumbCache', '%{public}s', '✅ 缩略图缓存目录最终路径: ' + this.cacheDir);
    } catch (e) {
      this.cacheDir = ctx.tempDir + '/thumbnails/';
      hilog.error(0x0000, 'ThumbCache', '%{public}s', '❌ 初始化失败，使用tempDir: ' + (e instanceof Error ? e.message : String(e)));
      
      try {
        if (!fs.accessSync(this.cacheDir)) {
          fs.mkdirSync(this.cacheDir);
        }
      } catch {}
    }
  }

  static getInstance(): ThumbnailCacheService {
    if (!ThumbnailCacheService.instance) {
      ThumbnailCacheService.instance = new ThumbnailCacheService();
    }
    return ThumbnailCacheService.instance;
  }

  getCacheDir(): string {
    return this.cacheDir;
  }

  async getThumbnailPath(fileName: string, fileSize?: number, isPreview: boolean = false): Promise<string> {
    if (!ThumbnailCacheService.isImageFile(fileName)) {
      hilog.debug(0x0000, 'ThumbCache', '%{public}s', '非图片文件，跳过缩略图: ' + fileName);
      return '';
    }
    if (fileSize !== undefined && fileSize > ThumbnailCacheService.MAX_THUMBNAIL_SIZE) {
      hilog.warn(0x0000, 'ThumbCache', '%{public}s', '文件过大，跳过缩略图: ' + fileName + ' (' + formatFileSize(fileSize) + ')');
      return '';
    }
    const safeName: string = (isPreview ? 'preview_' : 'thumb_') + sanitizeFileName(fileName);
    const sep: string = this.cacheDir.endsWith('/') ? '' : '/';
    const localPath: string = this.cacheDir + sep + safeName;

    try {
      if (fs.accessSync(localPath)) {
        const stat: fs.Stat = fs.statSync(localPath);
        if (stat.size > 0) {
          hilog.debug(0x0000, 'ThumbCache', '%{public}s', '命中缓存: ' + fileName);
          return localPath;
        } else {
          fs.unlinkSync(localPath);
        }
      }
    } catch {}

    if (isPreview) {
      await this.downloadFullImage(NasConfig.getFileUrl(fileName), localPath, fileName);
    } else {
      await this.downloadThumbnail(NasConfig.getFileUrl(fileName), localPath, fileName);
    }
    return localPath;
  }

  private async downloadFullImage(url: string, localPath: string, fileName: string): Promise<void> {
    let httpRequest: http.HttpRequest | null = null;
    return new Promise<void>((resolve: () => void, reject: (reason: Error) => void) => {
      try {
        httpRequest = http.createHttp();
      } catch (e) {
        reject(new Error('HTTP未初始化: ' + (e instanceof Error ? e.message : String(e))));
        return;
      }

      hilog.info(0x0000, TAG, '%{public}s', '开始下载完整预览图: ' + fileName + ' URL=' + url);

      httpRequest.request(url, {
        method: http.RequestMethod.GET,
        header: {
          'Authorization': getAuthHeader(),
          'Accept': 'image/*',
          'User-Agent': 'NASPhotoSync/1.0'
        },
        connectTimeout: NasConfig.TIMEOUT_MS,
        readTimeout: 30000,
        expectDataType: http.HttpDataType.ARRAY_BUFFER
      }, (_err: Error, data: http.HttpResponse) => {
        if (!data || data.responseCode !== 200) {
          const errMsg: string = '下载失败: HTTP ' + String(data?.responseCode ?? 'unknown') + ' file=' + fileName;
          hilog.error(0x0000, 'ThumbCache', '%{public}s', errMsg);
          reject(new Error(errMsg));
          return;
        }

        try {
          if (data.result instanceof ArrayBuffer) {
            if (data.result.byteLength === 0) {
              reject(new Error('空响应体: ' + fileName));
              return;
            }
            safeWriteFile(localPath, data.result);
            hilog.info(0x0000, TAG, '%{public}s', '完整预览图下载成功: ' + fileName + ' 大小=' + String(data.result.byteLength));
            resolve();
          } else if (typeof data.result === 'string') {
            if (data.result.length === 0) {
              reject(new Error('空响应体(string): ' + fileName));
              return;
            }
            const buffer: ArrayBuffer = stringToArrayBuffer(data.result);
            safeWriteFile(localPath, buffer);
            hilog.info(0x0000, TAG, '%{public}s', '完整预览图下载成功(string): ' + fileName + ' 大小=' + String(buffer.byteLength));
            resolve();
          } else {
            reject(new Error('无效的响应数据类型: ' + typeof data.result + ' file=' + fileName));
          }
        } catch (e) {
          hilog.error(0x0000, TAG, '%{public}s', '写入文件失败: ' + localPath + ' error=' + (e instanceof Error ? e.message : String(e)));
          reject(e instanceof Error ? e : new Error('写入文件失败'));
        } finally {
          if (httpRequest) { try { httpRequest.destroy(); } catch {} }
        }
      });
    });
  }

  private async downloadThumbnail(url: string, localPath: string, fileName: string): Promise<void> {
    let httpRequest: http.HttpRequest | null = null;
    return new Promise<void>((resolve: () => void, reject: (reason: Error) => void) => {
      try {
        httpRequest = http.createHttp();
      } catch (e) {
        reject(new Error('HTTP请求对象创建失败: ' + (e instanceof Error ? e.message : String(e))));
        return;
      }

      hilog.info(0x0000, TAG, '%{public}s', '开始下载缩略图: ' + fileName);
      hilog.debug(0x0000, 'ThumbCache', '%{public}s', '   URL: ' + url);
      hilog.debug(0x0000, 'ThumbCache', '%{public}s', '   本地路径: ' + localPath);

      const startTime: number = Date.now();

      httpRequest.request(url, {
        method: http.RequestMethod.GET,
        header: {
          'Authorization': getAuthHeader(),
          'Accept': 'image/*,*/*;q=0.8',
          'User-Agent': 'NASPhotoSync/1.0',
          'Connection': 'keep-alive'
        },
        connectTimeout: NasConfig.TIMEOUT_MS,
        readTimeout: 20000,
        expectDataType: http.HttpDataType.ARRAY_BUFFER
      }, (err: Error, data: http.HttpResponse) => {
        const duration: number = Date.now() - startTime;
        hilog.info(0x0000, 'ThumbCache', '%{public}s', '⏱️ HTTP请求完成，耗时: ' + String(duration) + 'ms');

        if (err) {
          const errMsg: string = 'HTTP请求异常: ' + err.message + ' file=' + fileName;
          hilog.error(0x0000, 'ThumbCache', '%{public}s', errMsg);
          reject(new Error(errMsg));
          return;
        }

        if (!data) {
          reject(new Error('响应为空: ' + fileName));
          return;
        }

        hilog.debug(0x0000, 'ThumbCache', '%{public}s', '📊 响应状态码: ' + String(data.responseCode));
        hilog.debug(0x0000, 'ThumbCache', '%{public}s', '📊 响应类型: ' + typeof data.result);
        hilog.debug(0x0000, 'ThumbCache', '%{public}s', '📊 响应头: ' + JSON.stringify(data.header));

        if (data.responseCode !== 200) {
          const errMsg: string = '下载失败: HTTP ' + String(data.responseCode) + ' file=' + fileName;
          hilog.error(0x0000, 'ThumbCache', '%{public}s', errMsg);
          
          if (data.responseCode === 401) {
            hilog.error(0x0000, 'ThumbCache', '%{public}s', '❌ 认证失败！请检查WebDAV用户名密码');
          } else if (data.responseCode === 404) {
            hilog.error(0x0000, 'ThumbCache', '%{public}s', '❌ 文件不存在: ' + url);
          } else if (data.responseCode >= 500) {
            hilog.error(0x0000, 'ThumbCache', '%{public}s', '❌ 服务器错误');
          }
          
          reject(new Error(errMsg));
          return;
        }

        try {
          let writeSuccess: boolean = false;

          if (data.result instanceof ArrayBuffer) {
            if (data.result.byteLength === 0) {
              reject(new Error('空响应体(ArrayBuffer): ' + fileName));
              return;
            }

            hilog.info(0x0000, TAG, '%{public}s', '收到数据大小: ' + String(data.result.byteLength) + ' bytes');

            safeWriteFile(localPath, data.result);
            writeSuccess = true;

          } else if (typeof data.result === 'string') {
            if (data.result.length === 0) {
              reject(new Error('空响应体(String): ' + fileName));
              return;
            }

            hilog.info(0x0000, TAG, '%{public}s', '收到字符串长度: ' + String(data.result.length));

            const buffer: ArrayBuffer = stringToArrayBuffer(data.result);
            safeWriteFile(localPath, buffer);
            writeSuccess = true;

          } else {
            reject(new Error('未知的响应类型: ' + typeof data.result + ' file=' + fileName));
            return;
          }

          if (writeSuccess) {
            try {
              const stat: fs.Stat = fs.statSync(localPath);
              hilog.info(0x0000, 'ThumbCache', '%{public}s', '✅ 缩略图写入成功: ' + fileName + ' 大小=' + String(stat.size) + ' bytes');
              resolve();
            } catch (verifyErr) {
              hilog.warn(0x0000, 'ThumbCache', '%{public}s', '⚠️ 文件验证失败（但可能已写入）: ' + fileName);
              resolve();
            }
          }
          
        } catch (writeErr) {
          hilog.error(0x0000, 'ThumbCache', '%{public}s', '❌ 写入文件失败: ' + localPath);
          hilog.error(0x0000, 'ThumbCache', '%{public}s', '   错误详情: ' + (writeErr instanceof Error ? writeErr.message : String(writeErr)));
          
          try {
            if (fs.accessSync(localPath)) {
              fs.unlinkSync(localPath);
              hilog.info(0x0000, 'ThumbCache', '%{public}s', '🧹 已清理损坏的文件: ' + localPath);
            }
          } catch {}
          
          reject(writeErr instanceof Error ? writeErr : new Error('文件写入异常'));
        } finally {
          if (httpRequest) { try { httpRequest.destroy(); } catch {} }
        }
      });
    });
  }

  async clearCache(): Promise<void> {
    try {
      if (fs.accessSync(this.cacheDir)) {
        const files: string[] = await fs.listFile(this.cacheDir);
        const sep: string = this.cacheDir.endsWith('/') ? '' : '/';
        for (const file of files) {
          try {
            fs.unlinkSync(this.cacheDir + sep + file);
          } catch {}
        }
      }
    } catch {}
  }

  destroy(): void {}
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) { return String(bytes) + ' B'; }
  else if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + ' KB'; }
  else { return (bytes / 1048576).toFixed(1) + ' MB'; }
}

const APP_EMOJIS: string[] = ['\u{1F4F8}', '\u{1F4F7}', '\u{1F3A8}', '\u{1F4BC}', '\u{1F30F}', '\u{2600}\uFE0F', '\u{2728}', '\u{1F4DD}'];
function getRandomAppEmoji(): string { return APP_EMOJIS[Math.floor(Math.random() * APP_EMOJIS.length)]; }

class RawHttpResponse {
  statusCode: number = 0;
  statusMessage: string = '';
  headers: HttpHeaders = new HttpHeaders();
  body: string = '';
}

class RawHttpClient {
  private tcpSocket: socket.TCPSocket | null = null;
  private connected: boolean = false;

  constructor() {}

  async request(method: string, path: string, headers: HttpHeaders, body?: string): Promise<RawHttpResponse> {
    return new Promise<RawHttpResponse>((resolve: (value: RawHttpResponse) => void, reject: (reason: Error) => void) => {
      try {
        this.close();
        const client: socket.TCPSocket = socket.constructTCPSocketInstance();
        this.tcpSocket = client;
        const response: RawHttpResponse = new RawHttpResponse();
        let responseData: ArrayBuffer[] = [];
        let resolved: boolean = false;
        const timeoutId: number = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            this.closeSocket(client);
            reject(new Error('请求超时'));
          }
        }, NasConfig.TIMEOUT_MS);

        client.on('message', (value: socket.SocketMessageInfo) => {
          if (resolved) return;
          if (value.message instanceof ArrayBuffer) {
            responseData.push(value.message);
          }
        });

        client.on('close', () => {
          if (!resolved) {
            clearTimeout(timeoutId); resolved = true;
            if (responseData.length > 0) {
              const fullBuffer: Uint8Array = this.concatArrayBuffers(responseData);
              this.parseRawResponse(this.arrayBufferToString(fullBuffer), response);
            }
            this.releaseSocket(client);
            resolve(response);
          }
        });

        client.connect({ address: { address: NasConfig.WEBDAV_HOST, port: NasConfig.WEBDAV_PORT, family: 1 }, timeout: NasConfig.TIMEOUT_MS }).then(() => {
          this.connected = true;
          const rawRequest: string = this.buildRawRequest(method, path, headers, body);
          hilog.info(0x0000, 'RawHttp', '%{public}s', '发送请求: ' + method + ' ' + path);
          client.send({ data: rawRequest }).then((): void => {}).catch((sendErr: Error) => {
            if (!resolved) {
              clearTimeout(timeoutId);
              resolved = true;
              this.closeSocket(client);
              reject(sendErr);
            }
          });
        }).catch((connErr: Error) => {
          if (!resolved) {
            clearTimeout(timeoutId);
            resolved = true;
            this.closeSocket(client);
            reject(connErr);
          }
        });
      } catch { reject(new Error('原始HTTP请求异常')); }
    });
  }

  private buildRawRequest(method: string, path: string, headers: HttpHeaders, body?: string): string {
    const requestTarget: string = this.normalizeRequestTarget(path);
    let req: string = method + ' ' + requestTarget + ' HTTP/1.1\r\n';
    req += 'Host: ' + NasConfig.WEBDAV_HOST + ':' + String(NasConfig.WEBDAV_PORT) + '\r\nConnection: close\r\nUser-Agent: NASPhotoSync/1.0\r\n';
    if (body !== undefined) { headers.set('Content-Length', String(body.length)); }
    headers.forEach((header: HttpHeader) => { req += header.name + ': ' + header.value + '\r\n'; });
    req += '\r\n'; if (body !== undefined) { req += body; } return req;
  }

  private normalizeRequestTarget(pathOrUrl: string): string {
    const fullUrlMatch: RegExpExecArray | null = /^https?:\/\/[^/]+(\/.*)?$/i.exec(pathOrUrl);
    if (fullUrlMatch) {
      return fullUrlMatch[1] ?? '/';
    }
    return pathOrUrl === '' ? '/' : pathOrUrl;
  }

  private parseRawResponse(raw: string, resp: RawHttpResponse): void {
    const headerEndIndex: number = raw.indexOf('\r\n\r\n');
    if (headerEndIndex < 0) { resp.statusCode = 0; resp.body = raw; return; }
    resp.body = raw.substring(headerEndIndex + 4);
    const lines: string[] = raw.substring(0, headerEndIndex).split('\r\n');
    if (lines.length > 0) { const sp = /^HTTP\/\d\.\d\s+(\d+)\s*(.*)$/.exec(lines[0]); if (sp) { resp.statusCode = parseInt(sp[1], 10); resp.statusMessage = sp[2]; } }
    for (let i: number = 1; i < lines.length; i++) {
      const ci: number = lines[i].indexOf(':');
      if (ci > 0) {
        resp.headers.set(lines[i].substring(0, ci).trim(), lines[i].substring(ci + 1).trim());
      }
    }
  }

  private concatArrayBuffers(buffers: ArrayBuffer[]): Uint8Array {
    let t: number = 0; for (const b of buffers) { t += b.byteLength; }
    const r: Uint8Array = new Uint8Array(t); let o: number = 0;
    for (const b of buffers) { r.set(new Uint8Array(b), o); o += b.byteLength; } return r;
  }

  private arrayBufferToString(buffer: Uint8Array): string {
    let s: string = ''; for (let i: number = 0; i < buffer.length; i += 8192) { const e: number = Math.min(i + 8192, buffer.length); const c: string[] = []; for (let j: number = i; j < e; j++) { c.push(String.fromCharCode(buffer[j])); } s += c.join(''); } return s;
  }

  private releaseSocket(client: socket.TCPSocket | null): void {
    if (client && this.tcpSocket === client) {
      this.tcpSocket = null;
    }
    this.connected = false;
  }

  private closeSocket(client: socket.TCPSocket | null): void {
    if (client) {
      try { client.close(); } catch {}
    }
    this.releaseSocket(client);
  }

  close(): void {
    this.closeSocket(this.tcpSocket);
  }
}

async function checkNetworkConnection(): Promise<boolean> {
  try { const n: connection.NetHandle | null = await connection.getDefaultNet(); return !!n; } catch { return false; }
}

export class CameraService {
  private buildCapturePath(context: common.Context): string {
    const baseDir: string = context.cacheDir !== '' ? context.cacheDir : (context.tempDir !== '' ? context.tempDir : '/data/storage/el2/base/cache/');
    const fileName: string = 'temp_photo_' + String(Date.now()) + '_' + String(Math.floor(Math.random() * 900000) + 100000) + '.jpg';
    return baseDir + '/' + fileName;
  }

  private copyUriToLocal(uri: string, context: common.Context): string {
    let sourceFile: fs.File | null = null;
    let destinationFile: fs.File | null = null;
    try {
      const localPath: string = this.buildCapturePath(context);
      sourceFile = fs.openSync(uri, fs.OpenMode.READ_ONLY);
      destinationFile = fs.openSync(localPath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
      const buffer: ArrayBuffer = new ArrayBuffer(4096);
      let bytesRead: number = 0;
      do {
        bytesRead = fs.readSync(sourceFile.fd, buffer);
        if (bytesRead > 0) {
          const dataToWrite: ArrayBuffer = bytesRead === buffer.byteLength ? buffer : buffer.slice(0, bytesRead);
          fs.writeSync(destinationFile.fd, dataToWrite);
        }
      } while (bytesRead > 0);
      return localPath;
    } finally {
      if (sourceFile) {
        try { fs.closeSync(sourceFile); } catch {}
      }
      if (destinationFile) {
        try { fs.closeSync(destinationFile); } catch {}
      }
    }
  }

  async takePhoto(context: common.Context): Promise<CapturedPhotoResult | null> {
    try {
      const profile: cameraPicker.PickerProfile = {
        cameraPosition: camera.CameraPosition.CAMERA_POSITION_BACK
      };

      const result: cameraPicker.PickerResult = await cameraPicker.pick(context, [cameraPicker.PickerMediaType.PHOTO], profile);
      hilog.info(0x0000, 'Camera', '%{public}s', 'cameraPicker resultCode=' + String(result.resultCode) + ' resultUri=' + result.resultUri);
      if (result.resultUri === '') {
        return null;
      }

      const localPath: string = this.copyUriToLocal(result.resultUri, context);
      const stat: fs.Stat = fs.statSync(localPath);
      if (stat.size <= 0) {
        throw new Error('拍照结果为空文件');
      }

      hilog.info(0x0000, 'Camera', '%{public}s', '📸 拍照结果已保存到应用缓存: ' + localPath + ' 大小=' + String(stat.size));
      return new CapturedPhotoResult(localPath, result.resultUri);
    } catch (e) {
      const message: string = e instanceof Error ? e.message : String(e);
      hilog.error(0x0000, 'Camera', '%{public}s', '拍照失败: ' + message);
      throw new Error('拍照失败: ' + message);
    }
  }

  async release(): Promise<void> {}
}

export class WebDavUploadService {
  private httpRequest: http.HttpRequest | null = null;

  constructor() { this.httpRequest = http.createHttp(); }

  async uploadFile(localFilePath: string, fileName: string): Promise<boolean> {
    let rc: number = 0; let le: Error = new Error('上传最终失败');
    const sn: string = sanitizeFileName(fileName);
    while (rc < NasConfig.MAX_RETRY_COUNT) {
      try {
        const fileData: ArrayBuffer = await this.readFileAsArrayBuffer(localFilePath);
        if (fileData.byteLength === 0) { throw new Error('无法读取本地文件'); }
        const ok: boolean = await this.executeUpload(fileData, sn);
        if (ok) { await this.deleteLocalFile(localFilePath); return true; }
        rc++; le = new Error('上传返回失败'); if (rc < NasConfig.MAX_RETRY_COUNT) { await this.delay(NasConfig.RETRY_DELAY_MS); }
      } catch (e) { rc++; le = e instanceof Error ? e : new Error('上传失败'); if (rc < NasConfig.MAX_RETRY_COUNT) { await this.delay(NasConfig.RETRY_DELAY_MS); } }
    }
    throw le;
  }

  private async readFileAsArrayBuffer(fp: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve: (value: ArrayBuffer) => void, reject: (reason: Error) => void) => {
      let file: fs.File | null = null;
      try {
        file = fs.openSync(fp, fs.OpenMode.READ_ONLY);
        const st: fs.Stat = fs.statSync(fp);
        const buffer: ArrayBuffer = new ArrayBuffer(st.size);
        const bytesRead: number = fs.readSync(file.fd, buffer);
        resolve(bytesRead === buffer.byteLength ? buffer : buffer.slice(0, bytesRead));
      } catch { reject(new Error('读文件失败')); }
      finally {
        if (file) {
          try { fs.closeSync(file); } catch {}
        }
      }
    });
  }

  private async executeUpload(data: ArrayBuffer, fn: string): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
      try {
        if (!this.httpRequest) { reject(new Error('HTTP未初始化')); return; }
        const requestOptions: http.HttpRequestOptions = {
          method: http.RequestMethod.PUT,
          header: { 'Authorization': getAuthHeader(), 'Content-Type': 'application/octet-stream' },
          extraData: data,
          connectTimeout: NasConfig.TIMEOUT_MS,
          readTimeout: NasConfig.TIMEOUT_MS
        };
        this.httpRequest.request(NasConfig.getUploadUrl(fn), requestOptions, (_err: Error, d: http.HttpResponse) => {
          if (!d) { reject(new Error('无响应')); return; }
          if (d.responseCode >= 200 && d.responseCode < 300) { resolve(true); }
          else if (d.responseCode === 401) { reject(new Error('认证失败')); }
          else if (d.responseCode === 403) { reject(new Error('无写入权限')); }
          else if (d.responseCode === 404) { reject(new Error('路径不存在')); }
          else { reject(new Error('HTTP ' + String(d.responseCode))); }
        });
      } catch { reject(new Error('网络异常')); }
    });
  }

  private async deleteLocalFile(fp: string): Promise<void> { try { if (fs.accessSync(fp)) { fs.unlinkSync(fp); } } catch {} }
  private delay(ms: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(resolve, ms);
    });
  }
  destroy(): void { if (this.httpRequest) { this.httpRequest.destroy(); this.httpRequest = null; } }
}

export class WebDavListService {
  private rawClient: RawHttpClient = new RawHttpClient();

  async getFileList(): Promise<Array<NasFile>> {
    let rc: number = 0; let le: Error = new Error('获取列表失败');
    while (rc < NasConfig.MAX_RETRY_COUNT) {
      try { return await this.fetchDirectoryListing(); }
      catch (e) { rc++; le = e instanceof Error ? e : new Error('获取列表失败'); if (rc < NasConfig.MAX_RETRY_COUNT) { await this.delay(NasConfig.RETRY_DELAY_MS); } }
    }
    throw le;
  }

  private async fetchDirectoryListing(): Promise<Array<NasFile>> {
    const url: string = NasConfig.getListUrl();
    const body: string = '<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:allprop/></d:propfind>';
    const hdrs: HttpHeaders = new HttpHeaders();
    hdrs.set('Authorization', getAuthHeader());
    hdrs.set('Content-Type', 'application/xml;charset=utf-8');
    hdrs.set('Depth', '1');
    const rsp: RawHttpResponse = await this.rawClient.request('PROPFIND', url, hdrs, body);
    if (rsp.statusCode === 207) { return this.parseMultistatusResponse(rsp.body); }
    else if (rsp.statusCode === 401) { throw new Error('认证失败，请检查WebDAV用户名密码'); }
    else if (rsp.statusCode === 404) { throw new Error('WebDAV路径不存在: ' + NasConfig.WEBDAV_PATH); }
    else if (rsp.statusCode >= 500) { throw new Error('服务器错误(HTTP ' + String(rsp.statusCode) + ')'); }
    else if (rsp.statusCode === 0) { throw new Error('无响应，请检查网络连接或NAS地址'); }
    else { return this.tryParseAsHtmlOrText(rsp.body); }
  }

  private parseMultistatusResponse(xmlBody: string): Array<NasFile> {
    const files: Array<NasFile> = [];
    const rr: RegExp = /<[Dd]:response>([\s\S]*?)<\/[Dd]:response>/g;
    const ct: string = '<[Dd]:collection';
    const cl: RegExp = /<[Dd]:getcontentlength>(\d+)<\/[Dd]:getcontentlength>/i;
    let m: RegExpExecArray | null = rr.exec(xmlBody);
    while (m !== null) {
      const rx: string = m[1];
      const hp: RegExp = /<[Dd]:href>([\s\S]*?)<\/[Dd]:href>/i;
      const hm: RegExpExecArray | null = hp.exec(rx);
      if (hm) {
        let fn: string = hm[1].trim();
        const si: number = fn.lastIndexOf('/');
        if (si >= 0) { fn = fn.substring(si + 1); }
        if (fn === '' || fn === NasConfig.WEBDAV_PATH.replace(/^\//, '')) { m = rr.exec(xmlBody); continue; }
        const isDir: boolean = new RegExp(ct).test(rx);
        let fsz: number = 0;
        const sm: RegExpExecArray | null = cl.exec(rx);
        if (sm) { fsz = parseInt(sm[1], 10); }
        const dn: string = decodeURIComponent(fn);
        hilog.info(0x0000, 'WebDAV', '%{public}s', '解析文件: ' + dn + ' (dir=' + String(isDir) + ', size=' + String(fsz) + ')');
        files.push({ name: dn, isDirectory: isDir, size: fsz });
      }
      m = rr.exec(xmlBody);
    }
    hilog.info(0x0000, 'WebDAV', '%{public}s', 'XML解析完成，共 ' + String(files.length) + ' 个条目');
    return files;
  }

  private tryParseAsHtmlOrText(body: string): Array<NasFile> {
    const files: Array<NasFile> = [];
    const hp: RegExp = /href=["']?([^"'\s>]+)["']?/gi;
    let hm: RegExpExecArray | null = hp.exec(body);
    while (hm !== null) {
      let n: string = hm[1];
      if (n.endsWith('/')) { files.push({ name: decodeURIComponent(n.slice(0, -1)), isDirectory: true, size: 0 }); }
      else if (n !== '' && !n.startsWith('?') && !n.startsWith('/')) { files.push({ name: decodeURIComponent(n), isDirectory: false, size: 0 }); }
      hm = hp.exec(body);
    }
    return files;
  }

  async deleteFile(fileName: string): Promise<boolean> {
    let rc: number = 0; let le: Error = new Error('删除失败');
    while (rc < NasConfig.MAX_RETRY_COUNT) {
      try {
        const url: string = NasConfig.getFileUrl(fileName);
        const hdrs: HttpHeaders = new HttpHeaders();
        hdrs.set('Authorization', getAuthHeader());
        const rsp: RawHttpResponse = await this.rawClient.request('DELETE', url, hdrs);
        if (rsp.statusCode >= 200 && rsp.statusCode < 300) {
          hilog.info(0x0000, 'WebDAV', '%{public}s', '文件已删除: ' + fileName);
          return true;
        } else if (rsp.statusCode === 404) { throw new Error('文件不存在'); }
        else if (rsp.statusCode === 401) { throw new Error('认证失败'); }
        else if (rsp.statusCode === 403) { throw new Error('无删除权限'); }
        else { throw new Error('HTTP ' + String(rsp.statusCode)); }
      } catch (e) { rc++; le = e instanceof Error ? e : new Error('删除失败'); if (rc < NasConfig.MAX_RETRY_COUNT) { await this.delay(NasConfig.RETRY_DELAY_MS); } }
    }
    throw le;
  }

  private delay(ms: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(resolve, ms);
    });
  }
  destroy(): void { this.rawClient.close(); }
}

@Entry
@Component
struct Index {
  private readonly appEmoji: string = getRandomAppEmoji();
  @State photoPath: string = '';
  @State isLoading: boolean = false;
  @State loadingText: string = '';
  @State nasFiles: Array<NasFile> = [];
  @State nasError: string = '';
  @State isRefreshing: boolean = false;
  @State btnScale: number = 1.0;
  @State fileListOpacity: number = 1.0;
  @State thumbMode: boolean = true;
  @State thumbPaths: Map<string, string> = new Map<string, string>();
  @State autoUpload: boolean = false;
  @State showDeleteDialog: boolean = false;
  @State fileToDelete: string = '';
  @State isDeleting: boolean = false;
  private statusBarHeight: number = 0;
  private navBarHeight: number = 0;
  @State longPressedItem: string = '';
  @State selectedImage: string = '';
  @State selectedImagePath: string = '';
  @State viewerVisible: boolean = false;
  @State currentTab: number = 0;
  @State failedThumbs: Set<string> = new Set<string>();

  @State settingsHost: string = '';
  @State settingsPort: string = '5005';
  @State settingsPath: string = '/photo/';
  @State settingsUser: string = '';
  @State settingsPass: string = '';
  @State settingsShowPass: boolean = false;
  @State settingsIsSaving: boolean = false;
  @State settingsSaveScale: number = 1.0;
  private capturedAssetUri: string = '';

  private cameraService: CameraService = new CameraService();
  private uploadService: WebDavUploadService = new WebDavUploadService();
  private listService: WebDavListService = new WebDavListService();
  private thumbnailService: ThumbnailCacheService = ThumbnailCacheService.getInstance();

  private getHostContext(): common.Context {
    const hostContext: common.Context | undefined = this.getUIContext().getHostContext() as common.Context | undefined;
    if (!hostContext) {
      throw new Error('Host context unavailable');
    }
    return hostContext;
  }

  private showToast(message: string, duration: number = 2000): void {
    try {
      const options: promptAction.ShowToastOptions = { message: message, duration: duration };
      this.getUIContext().getPromptAction().showToast(options);
    } catch (e) {
      hilog.warn(0x0000, TAG, '%{public}s', 'Toast显示失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  private runAnimation(value: AnimateParam, event: () => void): void {
    try {
      this.getUIContext().animateTo(value, event);
    } catch (e) {
      hilog.warn(0x0000, TAG, '%{public}s', '动画执行失败，回退为直接更新: ' + (e instanceof Error ? e.message : String(e)));
      event();
    }
  }

  private async ensurePermissions(permissionList: Array<string>, failureLogLabel: string): Promise<boolean> {
    try {
      const context: common.UIAbilityContext = this.getHostContext() as common.UIAbilityContext;
      const result = await context.requestPermissionsFromUser(permissionList, 0);
      if (!result.authResults || result.authResults.length !== permissionList.length) {
        return false;
      }
      for (let i: number = 0; i < result.authResults.length; i++) {
        if (result.authResults[i] !== 0) {
          return false;
        }
      }
      return true;
    } catch (e) {
      hilog.error(0x0000, TAG, '%{public}s', failureLogLabel + ': ' + (e instanceof Error ? e.message : String(e)));
      return false;
    }
  }

  private async ensureCameraPermission(): Promise<boolean> {
    return this.ensurePermissions(['ohos.permission.CAMERA'], '相机权限申请失败');
  }

  private async ensurePhotoDeletePermission(): Promise<boolean> {
    return this.ensurePermissions(['ohos.permission.WRITE_IMAGEVIDEO'], '相册删除权限申请失败');
  }

  private async deleteCapturedAsset(): Promise<void> {
    if (this.capturedAssetUri === '') {
      return;
    }
    const hasDeletePermission: boolean = await this.ensurePhotoDeletePermission();
    if (!hasDeletePermission) {
      this.showToast('已上传，但未授予相册写权限，无法自动删除系统相册照片', 3500);
      return;
    }
    try {
      await photoAccessHelper.MediaAssetChangeRequest.deleteAssets(this.getHostContext(), [this.capturedAssetUri]);
      hilog.info(0x0000, TAG, '%{public}s', '已删除系统相册照片资源: ' + this.capturedAssetUri);
      this.capturedAssetUri = '';
    } catch (e) {
      hilog.warn(0x0000, TAG, '%{public}s', '删除系统相册照片失败: ' + (e instanceof Error ? e.message : String(e)));
      this.showToast('已上传，但自动删除相册照片失败', 3000);
    }
  }

  aboutToAppear(): void {
    this.initFullScreen();
    const ctx: common.Context = this.getHostContext();
    NasConfig.initFromStorage(ctx).then(() => {
      this.thumbnailService.initCache(ctx).then(() => {
        AppStorageHelper.loadAutoUpload(ctx).then((v: boolean) => { 
          this.autoUpload = v; 
          this.settingsIsSaving = false;
        });
        this.loadSettingsConfig();
        this.loadNasFiles();
      });
    });
  }

  async loadSettingsConfig(): Promise<void> {
    try {
      const ctx: common.Context = this.getHostContext();
      const cfg = await AppStorageHelper.loadConfig(ctx);
      this.settingsHost = cfg.host;
      this.settingsPort = String(cfg.port);
      this.settingsPath = cfg.path;
      this.settingsUser = cfg.user;
      this.settingsPass = '';
      this.settingsShowPass = false;
      this.autoUpload = cfg.auto_upload;
      hilog.info(0x0000, 'Settings', '%{public}s', '✅ 设置配置加载完成');
    } catch (e) {
      hilog.error(0x0000, 'Settings', '%{public}s', '❌ 加载设置失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  async saveSettingsConfig(): Promise<void> {
    this.settingsIsSaving = true;
    this.runAnimation({ duration: 150 }, () => { this.settingsSaveScale = 0.95; });
    setTimeout(() => { this.runAnimation({ duration: 150 }, () => { this.settingsSaveScale = 1.0; }); }, 150);
    
    try {
      const ctx: common.Context = this.getHostContext();
      const nextPort: number = parseInt(this.settingsPort, 10) || DEFAULT_NAS_CONFIG.port;
      const nextPassword: string = this.settingsPass !== '' ? this.settingsPass : NasConfig.PASSWORD;
      await AppStorageHelper.saveConfig(ctx, this.settingsHost, nextPort, this.settingsPath, this.settingsUser, nextPassword, this.autoUpload);
      NasConfig.applyConfig(new NasStoredConfig(
        this.settingsHost.trim(),
        nextPort,
        this.settingsPath,
        this.settingsUser.trim(),
        nextPassword,
        this.autoUpload
      ));
      this.settingsHost = NasConfig.WEBDAV_HOST;
      this.settingsPort = String(NasConfig.WEBDAV_PORT);
      this.settingsPath = NasConfig.WEBDAV_PATH;
      this.settingsUser = NasConfig.USERNAME;
      this.settingsPass = nextPassword;
      
      this.showToast('✅ 配置已保存！', 2500);
      
      setTimeout(() => { this.loadNasFiles(); }, 500);
    } catch (e) {
      this.showToast('❌ 保存失败，请重试', 3000);
      hilog.error(0x0000, 'Settings', '%{public}s', '保存配置异常: ' + (e instanceof Error ? e.message : String(e)));
    } finally { 
      this.settingsIsSaving = false; 
    }
  }

  resetSettingsToDefault(): void {
    this.settingsHost = DEFAULT_NAS_CONFIG.host;
    this.settingsPort = String(DEFAULT_NAS_CONFIG.port);
    this.settingsPath = DEFAULT_NAS_CONFIG.path;
    this.settingsUser = DEFAULT_NAS_CONFIG.user;
    this.settingsPass = DEFAULT_NAS_CONFIG.pass;
    this.settingsShowPass = false;
    this.showToast('已恢复默认值', 2000);
  }

  private async initFullScreen(): Promise<void> {
    try {
      const ctx: common.UIAbilityContext = this.getHostContext() as common.UIAbilityContext;
      const win = await window.getLastWindow(ctx);
      const avoidArea = win.getWindowAvoidArea(window.AvoidAreaType.TYPE_SYSTEM);
      this.statusBarHeight = this.getUIContext().px2vp(avoidArea.topRect.height);
      this.navBarHeight = this.getUIContext().px2vp(avoidArea.bottomRect.height);
      await win.setWindowLayoutFullScreen(true);
      await win.setWindowSystemBarProperties({
        statusBarColor: '#00000000',
        navigationBarColor: '#00000000',
        statusBarContentColor: '#000000',
        navigationBarContentColor: '#000000'
      });
      hilog.info(0x0000, TAG, '%{public}s', '全屏适配完成 状态栏高度=' + String(this.statusBarHeight) + ' 导航栏高度=' + String(this.navBarHeight));
    } catch (e) {
      hilog.error(0x0000, TAG, '%{public}s', '全屏适配失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  }
  aboutToDisappear(): void {
    hilog.info(0x0000, TAG, '%{public}s', 'Index 组件即将销毁，开始清理资源');

    try {
      if (this.viewerVisible) {
        this.viewerVisible = false;
        this.selectedImage = '';
        this.selectedImagePath = '';
        hilog.info(0x0000, TAG, '%{public}s', '已关闭图片预览查看器');
      }

      if (this.showDeleteDialog) {
        this.showDeleteDialog = false;
        this.fileToDelete = '';
        hilog.info(0x0000, TAG, '%{public}s', '已关闭所有确认对话框');
      }

      if (this.isLoading || this.isDeleting) {
        this.isLoading = false;
        this.isDeleting = false;
        this.loadingText = '';
        hilog.info(0x0000, TAG, '%{public}s', '已重置加载状态');
      }

      this.nasFiles = [];
      this.thumbPaths.clear();
      this.failedThumbs.clear();
      this.currentTab = 0;

      hilog.info(0x0000, TAG, '%{public}s', '已清理所有状态数据');
    } catch (e) {
      hilog.error(0x0000, TAG, '%{public}s', '清理过程中出现异常: ' + (e instanceof Error ? e.message : String(e)));
    }

    try {
      this.cameraService.release();
      this.uploadService.destroy();
      this.listService.destroy();
      this.thumbnailService.destroy();
      hilog.info(0x0000, TAG, '%{public}s', '所有服务已销毁');
    } catch (e) {
      hilog.error(0x0000, TAG, '%{public}s', '服务销毁失败: ' + (e instanceof Error ? e.message : String(e)));
    }

    hilog.info(0x0000, TAG, '%{public}s', 'Index 组件资源清理完成');
  }

  async loadNasFiles(): Promise<void> {
    this.nasError = ''; this.isRefreshing = true; this.fileListOpacity = 0.3; this.thumbPaths.clear(); this.failedThumbs.clear();
    if (!NasConfig.isConfigured()) {
      this.nasError = '请先在设置中配置 NAS 连接信息';
      this.nasFiles = [];
      this.isRefreshing = false;
      this.fileListOpacity = 1;
      return;
    }
    const hasNet: boolean = await checkNetworkConnection();
    if (!hasNet) { this.nasError = '网络未连接'; this.showToast(this.nasError, 3000); this.nasFiles = []; this.isRefreshing = false; this.fileListOpacity = 1; return; }
    try {
      this.nasFiles = await this.listService.getFileList();
      if (this.nasFiles.length > 0) {
        await this.preloadThumbnails();
      }
    }
    catch (e) { const em: string = e instanceof Error ? e.message : 'NAS不可达'; this.showToast(em.length > 0 ? em : 'NAS不可达', 4000); this.nasFiles = []; }
    this.isRefreshing = false; this.runAnimation({ duration: 300, curve: Curve.EaseOut }, () => { this.fileListOpacity = 1; });
  }

  private async preloadThumbnails(): Promise<void> {
    const imageFiles: Array<NasFile> = this.nasFiles.filter((f: NasFile) => !f.isDirectory && ThumbnailCacheService.isImageFile(f.name));

    hilog.info(0x0000, TAG, '%{public}s', '开始预加载缩略图，共 ' + String(imageFiles.length) + ' 个图片文件');
    hilog.info(0x0000, TAG, '%{public}s', '缓存目录: ' + this.thumbnailService.getCacheDir());

    let successCount: number = 0;
    let failCount: number = 0;
    const CONCURRENCY: number = 3;

    const loadSingleFile = async (file: NasFile): Promise<void> => {
      if (this.failedThumbs.has(file.name)) {
        hilog.debug(0x0000, TAG, '%{public}s', '跳过已失败的缩略图: ' + file.name);
        return;
      }

      try {
        const path: string = await this.thumbnailService.getThumbnailPath(file.name, file.size);

        if (path !== '') {
          if (fs.accessSync(path)) {
            const stat: fs.Stat = fs.statSync(path);

            if (stat.size > 0) {
              this.thumbPaths.set(file.name, path);
              successCount++;
              hilog.info(0x0000, TAG, '%{public}s', '缩略图加载成功 [' + String(successCount) + '/' + String(imageFiles.length) + ']: ' + file.name);
            } else {
              this.failedThumbs.add(file.name);
              failCount++;
              try { fs.unlinkSync(path); } catch {}
            }
          } else {
            this.failedThumbs.add(file.name);
            failCount++;
          }
        } else {
          this.failedThumbs.add(file.name);
          failCount++;
        }
      } catch (e) {
        this.failedThumbs.add(file.name);
        failCount++;
      }
    };

    const batch: NasFile[] = imageFiles.slice(0, 20);
    for (let i: number = 0; i < batch.length; i += CONCURRENCY) {
      const batchItems: NasFile[] = batch.slice(i, i + CONCURRENCY);
      await Promise.allSettled(batchItems.map(loadSingleFile));
    }

    hilog.info(0x0000, TAG, '%{public}s', '预加载完成！成功=' + String(successCount) + ' 失败=' + String(failCount) + ' 总计=' + String(imageFiles.length));

    if (failCount > 0 && failCount === imageFiles.length) {
      this.showToast('缩略图加载失败，请检查网络和NAS配置', 4000);
    }
  }

  getThumbPath(fileName: string): string {
    const path: string = this.thumbPaths.get(fileName) ?? '';
    return path !== '' ? ('file://' + path) : '';
  }

  async handleTakePhoto(): Promise<void> {
    if (this.isLoading) return;
    if (!NasConfig.isConfigured()) {
      this.showToast('请先在设置中配置 NAS 连接信息', 2500);
      return;
    }
    const hasCameraPermission: boolean = await this.ensureCameraPermission();
    if (!hasCameraPermission) {
      this.showToast('未获得相机权限', 2500);
      return;
    }
    this.isLoading = true;
    this.loadingText = '正在启动相机...';
    this.runAnimation({ duration: 150 }, () => { this.btnScale = 0.95; });
    setTimeout(() => { this.runAnimation({ duration: 150 }, () => { this.btnScale = 1.0; }); }, 150);
    try {
      this.loadingText = '正在拍照...';
      const captureResult: CapturedPhotoResult | null = await this.cameraService.takePhoto(this.getHostContext());
      if (captureResult) {
        this.photoPath = captureResult.localPath;
        this.capturedAssetUri = captureResult.assetUri;
        hilog.info(0x0000, 'Camera', '%{public}s', '拍照成功，本地路径: ' + this.photoPath);
        this.showToast('拍照成功，正在上传...', 2000);
        await this.uploadAndClean();
      } else {
        this.capturedAssetUri = '';
        this.showToast('已取消拍照', 1500);
      }
    } catch (e) {
      const message: string = e instanceof Error ? e.message : String(e);
      hilog.error(0x0000, 'Camera', '%{public}s', '拍照失败: ' + message);
      this.showToast(message, 4000);
    } finally {
      this.isLoading = false;
      this.loadingText = '';
    }
  }

  async uploadAndClean(): Promise<void> {
    this.isLoading = true;
    this.loadingText = '正在上传到 NAS...';
    try {
      const fn: string = this.photoPath.split('/').pop() ?? 'photo.jpg';
      hilog.info(0x0000, 'Upload', '%{public}s', '开始上传文件: ' + fn);
      const ok: boolean = await this.uploadService.uploadFile(this.photoPath, fn);
      if (ok) {
        hilog.info(0x0000, 'Upload', '%{public}s', '上传成功: ' + fn);
        this.showToast('✅ 上传成功！', 2000);

        await this.deleteLocalPhoto();
        await this.deleteCapturedAsset();
        await this.loadNasFiles();
      } else {
        hilog.error(0x0000, 'Upload', '%{public}s', '上传失败: ' + fn);
        this.showToast('上传失败', 3000);
      }
    } catch (e) {
      hilog.error(0x0000, 'Upload', '%{public}s', '上传异常: ' + (e instanceof Error ? e.message : String(e)));
      this.showToast('上传失败', 3000);
    } finally {
      this.isLoading = false;
      this.loadingText = '';
      this.photoPath = '';
    }
  }

  private async deleteLocalPhoto(): Promise<void> {
    if (!this.photoPath) {
      hilog.warn(0x0000, 'Clean', '%{public}s', '⚠️ 本地照片路径为空');
      return;
    }

    try {
      if (fs.accessSync(this.photoPath)) {
        fs.unlinkSync(this.photoPath);
        hilog.info(0x0000, 'Clean', '%{public}s', '✅ 已删除临时照片: ' + this.photoPath);
      } else {
        hilog.warn(0x0000, 'Clean', '%{public}s', '⚠️ 临时照片文件不存在: ' + this.photoPath);
      }

      const dir: string = this.photoPath.substring(0, this.photoPath.lastIndexOf('/'));
      if (dir && fs.accessSync(dir)) {
        try {
          const files: string[] = await fs.listFile(dir);
          const tempFiles: string[] = files.filter((f: string) => f.startsWith('temp_photo_'));
          for (const tf of tempFiles) {
            try {
              fs.unlinkSync(dir + '/' + tf);
              hilog.debug(0x0000, 'Clean', '%{public}s', '🧹 清理旧临时文件: ' + tf);
            } catch {}
          }
        } catch {}
      }

      this.showToast('✅ 上传成功！本地已清理', 2500);
    } catch (e) {
      hilog.error(0x0000, 'Clean', '%{public}s', '❌ 删除失败: ' + (e instanceof Error ? e.message : String(e)));
      this.showToast('上传成功（清理失败）', 3000);
    }
  }

  toggleThumbMode(): void {
    this.thumbMode = !this.thumbMode;
    this.runAnimation({ duration: 250, curve: Curve.EaseInOut }, () => { this.fileListOpacity = 0.5; });
    setTimeout(() => { this.runAnimation({ duration: 200 }, () => { this.fileListOpacity = 1; }); }, 250);
  }

  onLongPressFile(fileName: string): void {
    if (fileName && !fileName.startsWith('.')) {
      this.longPressedItem = fileName;
      this.runAnimation({ duration: 100 }, () => {});
      setTimeout(() => {
        this.fileToDelete = fileName;
        this.showDeleteDialog = true;
        this.longPressedItem = '';
      }, 100);
    }
  }

  async confirmDelete(): Promise<void> {
    this.showDeleteDialog = false;
    if (!this.fileToDelete) return;
    this.isDeleting = true;
    try {
      const ok: boolean = await this.listService.deleteFile(this.fileToDelete);
      if (ok) {
        this.thumbPaths.delete(this.fileToDelete);
        this.nasFiles = this.nasFiles.filter((f: NasFile) => f.name !== this.fileToDelete);
        this.showToast('已删除: ' + this.fileToDelete, 2000);
      } else {
        this.showToast('删除失败', 3000);
      }
    } catch (e) {
      const errMsg: string = e instanceof Error ? e.message : '删除失败';
      this.showToast(errMsg, 3000);
    }
    finally { this.isDeleting = false; this.fileToDelete = ''; }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.fileToDelete = '';
  }

  async previewImage(fileName: string): Promise<void> {
    this.selectedImage = fileName;
    this.selectedImagePath = '';
    try {
      const f = this.nasFiles.find((item: NasFile) => item.name === fileName);

      hilog.info(0x0000, 'Preview', '%{public}s', '🖼️ 开始加载预览图: ' + fileName);
      this.showToast('正在加载图片...', 1500);

      let imagePath: string = '';

      try {
        imagePath = await this.thumbnailService.getThumbnailPath(fileName, f ? f.size : undefined, true);
      } catch (thumbErr) {
        hilog.error(0x0000, 'Preview', '%{public}s', '❌ 缩略图服务加载失败: ' + (thumbErr instanceof Error ? thumbErr.message : String(thumbErr)));
      }

      if (imagePath !== '' && fs.accessSync(imagePath)) {
        const stat: fs.Stat = fs.statSync(imagePath);
        if (stat.size > 0) {
          this.selectedImagePath = 'file://' + imagePath;
          hilog.info(0x0000, 'Preview', '%{public}s', '✅ 预览图加载成功: ' + fileName + ' 大小=' + String(stat.size));
        } else {
          hilog.error(0x0000, 'Preview', '%{public}s', '❌ 预览图文件为空');
          try { fs.unlinkSync(imagePath); } catch {}
          this.showToast('图片文件损坏', 2000);
          return;
        }
      } else {
        hilog.warn(0x0000, 'Preview', '%{public}s', '⚠️ 使用NAS URL直接加载...');
        this.selectedImagePath = NasConfig.getFileUrl(fileName);
        hilog.info(0x0000, 'Preview', '%{public}s', '🔄 URL: ' + this.selectedImagePath);
      }

      this.runAnimation({ duration: 250, curve: Curve.EaseInOut }, () => { this.viewerVisible = true; });
    } catch (e) {
      hilog.error(0x0000, 'Preview', '%{public}s', '💥 预览异常: ' + (e instanceof Error ? e.message : String(e)));
      this.showToast('图片加载失败', 2000);
    }
  }

  closeViewer(): void {
    this.runAnimation({ duration: 200 }, () => { this.viewerVisible = false; });
    setTimeout(() => { this.selectedImage = ''; this.selectedImagePath = ''; }, 200);
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Tabs({ barPosition: BarPosition.End, index: this.currentTab }) {
        TabContent() {
          this.MainPageContent()
        }.tabBar(this.PhotoTabBuilder())

        TabContent() {
          this.SettingsContent()
        }.tabBar(this.SettingsTabBuilder())
      }
      .width('100%').height('100%')
      .barBackgroundColor('#F8FFFFFF')
      .barMode(BarMode.Fixed)
      .animationDuration(250)
      .onChange((index: number) => {
        this.currentTab = index;
      })

      if (this.showDeleteDialog) { this.DeleteConfirmDialog() }
      if (this.isLoading) { this.LoadingOverlay() }
      if (this.isDeleting) { this.DeletingOverlay() }
      if (this.selectedImage !== '') { this.ImageViewerBuilder() }
    }.width('100%').height('100%').backgroundColor('#FAFAFA')
  }

  @Builder PhotoTabBuilder() {
    Column({ space: 2 }) {
      Text('📷').fontSize(22).fontColor(this.currentTab === 0 ? '#007DFF' : '#999999')
      Text('拍照').fontSize(10).fontColor(this.currentTab === 0 ? '#007DFF' : '#666666')
        .fontWeight(this.currentTab === 0 ? FontWeight.Medium : FontWeight.Normal)
    }.width('100%').height(56).justifyContent(FlexAlign.Center).alignItems(HorizontalAlign.Center)
  }

  @Builder SettingsTabBuilder() {
    Column({ space: 2 }) {
      Text('⚙️').fontSize(22).fontColor(this.currentTab === 1 ? '#007DFF' : '#999999')
      Text('设置').fontSize(10).fontColor(this.currentTab === 1 ? '#007DFF' : '#666666')
        .fontWeight(this.currentTab === 1 ? FontWeight.Medium : FontWeight.Normal)
    }.width('100%').height(56).justifyContent(FlexAlign.Center).alignItems(HorizontalAlign.Center)
  }

  @Builder SettingsContent() {
    Column() {
      Text('⚙️ NAS 设置').fontSize(19).fontWeight(FontWeight.Bold)
        .width('100%').padding({ left: 16, right: 16, top: this.statusBarHeight + 12, bottom: 14 })
        .textAlign(TextAlign.Center)

      Scroll() {
        Column({ space: 0 }) {
          Text('连接配置').fontSize(17).fontWeight(FontWeight.Bold).fontColor('#333333')
            .width('100%').padding({ left: 20, top: 20, bottom: 14 })

          Column({ space: 0 }) {
            Column() {
              Text('主机地址').fontSize(13).fontColor('#666666').margin({ bottom: 6 })
              TextInput({ text: this.settingsHost, placeholder: '例如: 192.168.1.100' })
                .height(44).fontSize(15).backgroundColor('#F5F5F5').borderRadius(10)
                .padding({ left: 14, right: 14 }).onChange((v: string) => { this.settingsHost = v; })
            }.margin({ left: 20, right: 20, bottom: 12 })

            Column() {
              Text('端口').fontSize(13).fontColor('#666666').margin({ bottom: 6 })
              TextInput({ text: this.settingsPort, placeholder: '默认: 5005' })
                .height(44).fontSize(15).backgroundColor('#F5F5F5').borderRadius(10)
                .padding({ left: 14, right: 14 }).type(InputType.Number)
                .onChange((v: string) => { this.settingsPort = v; })
            }.margin({ left: 20, right: 20, bottom: 12 })

            Column() {
              Text('WebDAV 路径').fontSize(13).fontColor('#666666').margin({ bottom: 6 })
              TextInput({ text: this.settingsPath, placeholder: '例如: /photo/' })
                .height(44).fontSize(15).backgroundColor('#F5F5F5').borderRadius(10)
                .padding({ left: 14, right: 14 }).onChange((v: string) => { this.settingsPath = v; })
            }.margin({ left: 20, right: 20, bottom: 18 })

            Divider().margin({ left: 24, right: 24 })

            Text('认证信息').fontSize(17).fontWeight(FontWeight.Bold).fontColor('#333333')
              .width('100%').padding({ left: 0, top: 16, bottom: 14 })

            Column() {
              Text('用户名').fontSize(13).fontColor('#666666').margin({ bottom: 6 })
              TextInput({ text: this.settingsUser, placeholder: 'WebDAV 用户名' })
                .height(44).fontSize(15).backgroundColor('#F5F5F5').borderRadius(10)
                .padding({ left: 14, right: 14 }).onChange((v: string) => { this.settingsUser = v; })
            }.margin({ left: 20, right: 20, bottom: 12 })

            Column() {
              Text('密码').fontSize(13).fontColor('#666666').margin({ bottom: 6 })
              Row() {
                TextInput({ text: this.settingsPass, placeholder: '留空则保持当前密码不变' })
                  .layoutWeight(1).height(44).fontSize(15).backgroundColor('#F5F5F5').borderRadius(10)
                  .padding({ left: 14, right: 14 }).type(this.settingsShowPass ? InputType.Normal : InputType.Password)
                  .onChange((v: string) => { this.settingsPass = v; })
                Button(this.settingsShowPass ? '\u{1F440}' : '\u{1F441}').width(44).height(44).fontSize(16)
                  .backgroundColor('#EEEEEE').borderRadius(10).onClick(() => { this.settingsShowPass = !this.settingsShowPass; })
              }.alignItems(VerticalAlign.Center)
            }.margin({ left: 20, right: 20, bottom: 8 })

            Text('留空则保持当前密码不变').fontSize(11).fontColor('#AAAAAA').margin({ left: 20, bottom: 20 })

            Divider().margin({ left: 24, right: 24 })

            Text('上传设置').fontSize(17).fontWeight(FontWeight.Bold).fontColor('#333333')
              .width('100%').padding({ left: 0, top: 16, bottom: 14 })

            Row() {
              Column() {
                Text('自动上传').fontSize(15).fontColor('#333333')
                Text('拍照后自动上传至NAS，无需手动确认').fontSize(12).fontColor('#888888').margin({ top: 3 })
              }.layoutWeight(1).alignItems(HorizontalAlign.Start)
              Toggle({ type: ToggleType.Switch, isOn: this.autoUpload })
                .onChange((isOn: boolean) => { this.autoUpload = isOn; })
            }.width('100%').padding({ left: 20, right: 20, bottom: 20 }).justifyContent(FlexAlign.SpaceBetween)
          }.width('100%')

          Divider().margin({ left: 24, right: 24 })

          Row({ space: 14 }) {
            Button('恢复默认').layoutWeight(1).height(44).fontSize(14).type(ButtonType.Normal)
              .borderRadius(22).backgroundColor('#FFF0F0').fontColor('#CC0000')
              .onClick(() => this.resetSettingsToDefault())
            Button('保存配置').layoutWeight(1).height(44).fontSize(15).fontColor('#FFFFFF')
              .backgroundColor('#007DFF').borderRadius(22).enabled(!this.settingsIsSaving)
              .scale({ x: this.settingsSaveScale, y: this.settingsSaveScale })
              .onClick(() => this.saveSettingsConfig())
          }.width('100%').padding({ left: 20, right: 20, top: 10, bottom: 30 })

          Column() {
            Text('\u{1F4A1} 提示').fontSize(13).fontWeight(FontWeight.Medium).fontColor('#007DFF').margin({ bottom: 8 })
            Text('修改配置后需要返回主页面重新加载文件列表').fontSize(12).fontColor('#999999')
              .textAlign(TextAlign.Center).lineHeight(18)
            Text('支持飞牛(fnOS)、群晖等 WebDAV 协议的 NAS 设备').fontSize(12).fontColor('#BBBBBB')
              .textAlign(TextAlign.Center).lineHeight(18).margin({ top: 4 })
          }.width('90%').padding(14).borderRadius(10).backgroundColor('#F7FBFF').margin({ bottom: 30 })
        }
      }.width('100%').layoutWeight(1)

      if (this.settingsIsSaving) {
        Column() {
          LoadingProgress().width(40).height(40).color('#007DFF').margin({ bottom: 12 })
          Text('保存中...').fontSize(14).fontColor('#888888')
        }.width('100%').height('100%').position({ x: 0, y: 0 }).backgroundColor('#90000000')
          .justifyContent(FlexAlign.Center).alignItems(HorizontalAlign.Center).zIndex(100)
      }
    }.width('100%').height('100%').backgroundColor('#FAFAFA')
  }

  @Builder MainPageContent() {
    Column() {
      Row() {
        Text(this.appEmoji).fontSize(26).margin({ right: 8 })
        Column() {
          Text($r('app.string.title_main')).fontSize(19).fontWeight(FontWeight.Bold)
          Text('NAS Photo Sync').fontSize(11).fontColor('#888888').margin({ top: 2 })
        }.alignItems(HorizontalAlign.Start).layoutWeight(1)
      }.width('100%').height(48).padding({ left: 16, right: 16 }).justifyContent(FlexAlign.SpaceBetween).alignItems(VerticalAlign.Center)
      .margin({ top: this.statusBarHeight + 4 })

      Button($r('app.string.btn_take_photo')).width('90%').height(50).fontSize(17)
        .backgroundColor('#007DFF').fontColor('#FFFFFF').borderRadius(25)
        .enabled(!this.isLoading).scale({ x: this.btnScale, y: this.btnScale })
        .onClick(() => this.handleTakePhoto()).margin({ top: 12, bottom: 4 })

      Text('📸 拍照后自动上传至NAS并清理本地文件').fontSize(11).fontColor('#999999')
        .width('90%').textAlign(TextAlign.Center).margin({ bottom: 10 })

      Row({ space: 10 }) {
        Button(this.thumbMode ? '📋 列表' : '🖼️ 网格').layoutWeight(1).height(42).fontSize(13).type(ButtonType.Normal)
          .borderRadius(21).onClick(() => this.toggleThumbMode())
      }.width('90%').margin({ bottom: 14 })

      Divider().margin({ left: 20, right: 20 })

      Row() {
        Text('NAS 文件列表').fontSize(15).fontWeight(FontWeight.Medium).layoutWeight(1)
        Button(this.isRefreshing ? '刷新中...' : '🔄 刷新').type(ButtonType.Normal).height(32).fontSize(12).fontColor('#007DFF')
          .borderRadius(16).enabled(!this.isRefreshing).onClick(() => this.loadNasFiles())
      }.width('100%').padding({ left: 16, right: 16 }).height(40).alignItems(VerticalAlign.Center).margin({ top: 8, bottom: 6 })

      if (this.nasError !== '') {
        Row() {
          Text('⚠ ').fontSize(13).fontColor('#CC3300')
          Text(this.nasError).fontSize(12).fontColor('#CC3300').layoutWeight(1)
        }.width('92%').padding(10).borderRadius(8).backgroundColor('#FFF5F5').margin({ bottom: 6 })
      }

      if (this.thumbMode && this.nasFiles.length > 0) {
        Grid() {
          ForEach(this.nasFiles.filter((f: NasFile) => !f.isDirectory), (file: NasFile) => {
            GridItem() {
              Column() {
                if (this.getThumbPath(file.name) !== '' && !this.failedThumbs.has(file.name)) {
                  Image(this.getThumbPath(file.name))
                    .width('100%')
                    .aspectRatio(1)
                    .objectFit(ImageFit.Cover)
                    .borderRadius(8)
                    .backgroundColor('#F0F0F0')
                    .interpolation(ImageInterpolation.High)
                    .onComplete(() => {
                      hilog.debug(0x0000, TAG, '%{public}s', '缩略图加载成功: ' + file.name);
                    })
                    .onError((err: ImageError) => {
                      hilog.warn(0x0000, TAG, '%{public}s', '缩略图渲染失败: ' + file.name);
                      this.thumbPaths.delete(file.name);
                      this.failedThumbs.add(file.name);
                    })
                } else if (this.failedThumbs.has(file.name)) {
                  Column() {
                    Text('❌').fontSize(18).fontColor('#CCCCCC')
                    Text('加载失败').fontSize(9).fontColor('#999999').margin({ top: 2 })
                  }
                  .width('100%')
                  .aspectRatio(1)
                  .justifyContent(FlexAlign.Center)
                  .backgroundColor('#FAFAFA')
                  .borderRadius(8)
                  .border({ width: 1, color: '#EEEEEE', style: BorderStyle.Dashed })
                } else {
                  Column() {
                    LoadingProgress()
                      .width(24)
                      .height(24)
                      .color('#CCCCCC')
                    Text('加载中...')
                      .fontSize(9)
                      .fontColor('#999999')
                      .margin({ top: 4 })
                  }
                  .width('100%')
                  .aspectRatio(1)
                  .justifyContent(FlexAlign.Center)
                  .backgroundColor('#F5F5F5')
                  .borderRadius(8)
                  .border({ width: 1, color: '#E0E0E0', style: BorderStyle.Dashed })
                }
                Text(file.name).fontSize(10).maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
                  .width('100%').margin({ top: 3 })
                Text(formatFileSize(file.size)).fontSize(9).fontColor('#999999')
              }.width('100%').padding(5).onClick(() => this.previewImage(file.name))
              .borderRadius(8).backgroundColor('#FAFAFA')
              .scale({ x: this.longPressedItem === file.name ? 0.95 : 1.0, y: this.longPressedItem === file.name ? 0.95 : 1.0 })
              .opacity(this.longPressedItem === file.name ? 0.7 : 1.0)
              .gesture(
                LongPressGesture({ repeat: false, duration: 300 })
                  .onAction((event?: GestureEvent) => { this.onLongPressFile(file.name); })
              )
            }
          }, (file: NasFile) => file.name)
        }.columnsTemplate('1fr 1fr 1fr').width('94%').layoutWeight(1)
          .padding(6).scrollBar(BarState.Auto).margin({ top: 4, bottom: 4 })
      } else {
        List({ space: 6 }) {
          ForEach(this.nasFiles, (file: NasFile) => {
            ListItem() {
              Row() {
                Text(file.isDirectory ? '📁' : '🖼️').fontSize(22).width(24).height(24).margin({ right: 8 })
                Text(file.name).fontSize(13).layoutWeight(1).maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
                if (!file.isDirectory) { Text(formatFileSize(file.size)).fontSize(11).fontColor('#888888').margin({ left: 4 }) }
              }.width('100%').padding({ left: 12, right: 12, top: 8, bottom: 8 })
              .borderRadius(8).backgroundColor('#F5F5F5')
              .scale({ x: this.longPressedItem === file.name ? 0.98 : 1.0, y: this.longPressedItem === file.name ? 0.98 : 1.0 })
              .opacity(this.longPressedItem === file.name ? 0.7 : 1.0)
              .gesture(
                LongPressGesture({ repeat: false, duration: 300 })
                  .onAction((event?: GestureEvent) => { this.onLongPressFile(file.name); })
              )
            }
          }, (file: NasFile) => file.name)
        }.width('94%').height(300).padding(4).opacity(this.fileListOpacity)
      }

      if (this.nasFiles.length === 0 && !this.isLoading && this.nasError === '') {
        Column() {
          Text('📂').fontSize(38).margin({ bottom: 10 })
          Text($r('app.string.empty_file_list')).fontSize(13).fontColor('#BBBBBB')
        }.width('100%').layoutWeight(1).justifyContent(FlexAlign.Center).margin({ top: 30 })
      }
    }.width('100%').height('100%')
    .padding({ bottom: 8 })
  }

  @Builder LoadingOverlay() {
    Column() {
      LoadingProgress().width(48).height(48).color('#007DFF').margin({ bottom: 16 })
      Text(this.loadingText).fontSize(15).fontColor('#555555')
    }.width('100%').height('100%').position({ x: 0, y: 0 }).backgroundColor('#90000000')
      .justifyContent(FlexAlign.Center).alignItems(HorizontalAlign.Center).zIndex(100)
  }

  @Builder DeleteConfirmDialog() {
    Column() {
      Text('🗑️ 确认删除').fontSize(19).fontWeight(FontWeight.Bold).margin({ bottom: 12 })
      Text('确定要删除以下文件吗？\n此操作不可恢复！').fontSize(14).fontColor('#555555').textAlign(TextAlign.Center).margin({ bottom: 12 })
      Text(this.fileToDelete).fontSize(13).fontColor('#CC0000').fontWeight(FontWeight.Medium)
        .maxLines(2).textOverflow({ overflow: TextOverflow.Ellipsis }).textAlign(TextAlign.Center)
        .width('90%').backgroundColor('#FFF5F5').padding(10).borderRadius(8).margin({ bottom: 24 })
      Row({ space: 14 }) {
        Button('取消').layoutWeight(1).height(42).fontSize(15).backgroundColor('#E8E8E8').fontColor('#333333').borderRadius(21)
          .onClick(() => this.cancelDelete())
        Button('🗑️ 删除').layoutWeight(1).height(42).fontSize(15).backgroundColor('#CC0000').fontColor('#FFFFFF').borderRadius(21)
          .onClick(() => this.confirmDelete())
      }.width('100%')
    }.width('82%').padding(24).backgroundColor('#FFFFFF').borderRadius(16)
      .shadow({ radius: 24, color: '#22000000', offsetX: 0, offsetY: 8 })
  }

  @Builder DeletingOverlay() {
    Column() {
      LoadingProgress().width(48).height(48).color('#CC0000').margin({ bottom: 16 })
      Text('正在删除...').fontSize(15).fontColor('#555555')
    }.width('100%').height('100%').position({ x: 0, y: 0 }).backgroundColor('#90000000')
      .justifyContent(FlexAlign.Center).alignItems(HorizontalAlign.Center).zIndex(100)
  }

  @Builder ImageViewerBuilder() {
    Stack({ alignContent: Alignment.TopEnd }) {
      Image(this.selectedImagePath).objectFit(ImageFit.Contain)
        .width('100%').height('100%').backgroundColor('#000000')
        .onComplete(() => {})
        .onError((err: ImageError) => { hilog.error(0x0000, 'Viewer', '%{public}s', '查看大图失败: ' + this.selectedImage); })
      Column({ space: 12 }) {
        Button('✕').width(36).height(36).fontSize(20).backgroundColor('#CC000000').fontColor('#FFFFFF').borderRadius(18)
          .onClick(() => this.closeViewer())
        Text(this.selectedImage).fontSize(13).fontColor('#FFFFFF').maxLines(1).textOverflow({ overflow: TextOverflow.Ellipsis })
          .width(160).textAlign(TextAlign.Center)
        Text(formatFileSize(this.getSelectedSize())).fontSize(12).fontColor('#CCCCCC')
      }.position({ right: 12, top: this.statusBarHeight + 12 }).alignItems(HorizontalAlign.End)
    }.width('100%').height('100%').position({ x: 0, y: 0 }).backgroundColor('#E0000000')
      .visibility(this.viewerVisible ? Visibility.Visible : Visibility.Hidden)
  }

  getSelectedSize(): number {
    const f = this.nasFiles.find((f: NasFile) => f.name === this.selectedImage);
    return f ? f.size : 0;
  }
}
