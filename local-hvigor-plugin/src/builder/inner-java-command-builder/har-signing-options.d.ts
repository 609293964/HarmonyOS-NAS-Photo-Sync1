import { SigningOptionsV2 } from './signing-options-v2';
/**
 * 签名工具sdk-sign-tool的签名options
 *
 * @since 2024/05/11
 */
export declare class HarSigningOptions extends SigningOptionsV2 {
    sign(): this;
    addAppCertFile(certPath: string): this;
}
