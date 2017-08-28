import {TypeManager} from "../types/type-manager";
import {TypeField} from "../types/types";

export class RiaCache {
    private types: TypeManager;

    constructor(types: TypeManager) {
        this.types = types;
    }

    public getFields(type: string): TypeField[] {
        return this.types.getFields(type);
    }
}
