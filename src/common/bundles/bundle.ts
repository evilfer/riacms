import {TypeManagerBuilder} from "../types/type-manager-builder";

export interface CmsRequest {
    url: string;
}

export abstract class Bundle {
    public abstract getName(): string;

    public getDependencies(): string[] {
        return [];
    }

    public applyTypes(typeBuilder: TypeManagerBuilder): void {
        return;
    }
}
