import { ProjectBuildProfile } from './project-build-profile.js';
import SigningConfigBuildOpt = ProjectBuildProfile.SigningConfigBuildOpt;
export type AppOhosConfig = {
    overrides?: Overrides;
};
export type AppOpt = {
    vendor: string;
    versionCode?: number;
    versionName?: string;
    bundleType?: string;
    bundleName?: string;
    icon?: string;
    label?: string;
};
export type Overrides = {
    appOpt?: AppOpt;
    signingConfig?: SigningConfigBuildOpt;
};
