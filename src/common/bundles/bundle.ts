import {TypeManagerBuilder} from "../types/type-manager-builder";

export abstract class Bundle {
    public abstract getName(): string;

    public getDependencies(): string[] {
        return [];
    }

    public applyTypes(typeBuilder: TypeManagerBuilder): void {
        return;
    }
}
