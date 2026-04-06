import { Component } from '@ohos/sdkmanager-common';
import { HosSdkComponent } from '../superior/hos-sdk-component.js';
/**
 * sdk java实例
 */
export declare class SdkJavaComponent extends HosSdkComponent {
    private static readonly BUILD_TOOLS;
    constructor(component: Component);
    getRestoolPath(): string;
    getReleaseType(): string;
}
