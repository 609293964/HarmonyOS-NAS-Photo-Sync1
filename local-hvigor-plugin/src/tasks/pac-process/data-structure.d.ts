import PackageObj = PackInfo.PackageObj;
import { PackInfo } from '../../options/configure/pack-info-options.js';
export interface DataLabel {
    label: string;
    purposes: string[];
}
export interface DataProcess {
    dataType: string;
    dataLabels: DataLabel[];
}
export interface SpecialAPI {
    apiType: string;
    reasons: string[];
}
export interface DependencyInfo {
    author?: string;
    name: string;
    description?: string;
    version?: string;
}
export interface PackageJsonWithOtherInfo extends PackageObj {
    author?: string;
    name: string;
    description?: string;
    version?: string;
}
export interface PacFile {
    dataProcess?: DataProcess[];
    specialAPIs?: SpecialAPI[];
    dependencies?: DependencyInfo[];
}
