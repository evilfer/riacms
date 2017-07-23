import {TypeDefinitionMap, TypeField} from "./types";

export class TypeManager {
    private types: TypeDefinitionMap;

    public constructor(types: TypeDefinitionMap) {
        this.types = types;
    }

    public getFields(name: string): TypeField[] {
        return this.types[name].fields;
    }
}
