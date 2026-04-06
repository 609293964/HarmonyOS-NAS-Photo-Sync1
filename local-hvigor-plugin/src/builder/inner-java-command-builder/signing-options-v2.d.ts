import { JavaCommandBuilder } from '../java-command-builder.js';
/**
 * 新签名工具hap-sign-tool的签名options
 *
 * @since 2022/03/01
 */
export declare class SigningOptionsV2 extends JavaCommandBuilder {
    sign(): SigningOptionsV2;
    addMode(mode: string): SigningOptionsV2;
    addProfileFile(profile: string): SigningOptionsV2;
    profileSigned(): SigningOptionsV2;
    addInForm(inFormType: string): SigningOptionsV2;
    addSignAlg(signAlg: string): SigningOptionsV2;
    addKeyAlias(privateKey: string): SigningOptionsV2;
    addKeyStoreFile(keyStoreFile: string): SigningOptionsV2;
    addKeyStorePwd(keyStorePwd: string): SigningOptionsV2;
    addKeyPwd(keyAliasPwd: string): SigningOptionsV2;
    addAppCertFile(certPath: string): SigningOptionsV2;
    addInputFile(inputFile: string): SigningOptionsV2;
    addOutputFile(outputFile: string): SigningOptionsV2;
}
