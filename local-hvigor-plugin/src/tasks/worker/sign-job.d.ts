import { SignPackageConfig } from '../sign-packages-from-app.js';
import { SignConfig } from '../sign-remote-hsp.js';
export declare const runSign: (config: SignConfig) => Promise<void>;
export declare const signPackageFromApp: (config: SignPackageConfig) => Promise<void>;
