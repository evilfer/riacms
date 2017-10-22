import {TypeDefinitionMap, TypeField, TypeFieldTypes} from "./types";

export class TypeManager {
    private types: TypeDefinitionMap;

    public constructor(types: TypeDefinitionMap) {
        this.types = types;
    }

    public getFields(name: string): TypeField[] {
        return this.types[name].fields;
    }

    public getFieldType(name: string, field: string): null | TypeFieldTypes {
        return (this.types[name] &&
            this.types[name].fieldMap[field] &&
            this.types[name].fieldMap[field].type) || null;
    }

    public getImplementedBy(name: string): string[] {
        return this.types[name].implementedBy;
    }

    public isA(entity: { _type: string }, type: string): boolean {
        return this.types[type] && this.types[type].implementedBy.indexOf(entity._type) >= 0;
    }
}
