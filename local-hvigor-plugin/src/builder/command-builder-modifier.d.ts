import { BaseCommandBuilder } from './base-command-builder.js';
export interface CommandModifier {
    modify: (command: string[]) => string[];
}
export declare enum CommandBuilderType {
    NONE = 0,
    CMAKE = 1,
    NINJA = 2
}
export declare function registryCommandModifier(cmdBuilderType: CommandBuilderType, modifier: CommandModifier): void;
export declare class CommandBuilderModifier<T extends BaseCommandBuilder> {
    static modifiers: Map<CommandBuilderType, CommandModifier>;
    private readonly commandBuilder;
    private readonly cmdBuilderType;
    constructor(commandBuilder: T, cmdBuilderType: CommandBuilderType);
    static registerModifier(cs: CommandBuilderType, mod: CommandModifier): void;
    wrapCommandBuilder(): T;
}
