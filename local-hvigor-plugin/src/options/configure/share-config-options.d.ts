import { RequiredNamed } from '../options.js';
export declare namespace ShareConfigOptions {
    interface ShareConfigOpt extends RequiredNamed {
        crossAppSharedConfig: ShareConfigObj[];
    }
    interface ShareConfigObj extends RequiredNamed {
        uri: string;
        value: string;
        allowList: string[];
        moduleNodeDir?: string;
        originalSuffix?: string;
        packageName?: string;
    }
    interface intermediatesShareConfigObj extends RequiredNamed {
        uri: string;
        value: string;
        allowList: string[];
    }
}
