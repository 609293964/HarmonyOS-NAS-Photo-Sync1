/**
 * 判断是否是源码目录迁移后的模板
 *
 * @param {string} srcOhosTestPath ohosTest默认源码目录
 * @return {boolean} true/false
 */
export declare function isTemplatesAfterSourceCodeMigration(srcOhosTestPath: string): boolean;
export declare function getOhosTestIntermediatesSrcOhosTestRelativePath(): string;
export declare function getOhosTestIntermediatesEtsPath(modulePath: string): string;
export declare function getOhosTestAbilityConfig(): {
    description: string;
    mainElement: string;
    pages: string;
    abilities: {
        name: string;
        srcEntry: string;
        description: string;
        label: string;
        exported: boolean;
    }[];
};
