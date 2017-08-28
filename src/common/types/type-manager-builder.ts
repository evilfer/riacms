import {EntityContent, EntityContentValue} from "../cache/entity-content";
import {TypeManager} from "./type-manager";
import {TypeDefinitionMap, TypeField} from "./types";

export class TypeManagerBuilder {
    private types: TypeDefinitionMap;

    public constructor() {
        this.types = {};
    }

    public createAbstractType(name: string, fields: TypeField[]): void {
        this.createType(name, false, fields);
    }

    public createConcreteType(name: string, fields: TypeField[]): void {
        this.createType(name, true, fields);
    }

    public extendType(name: string, fields: TypeField[]): void {
        fields.forEach(field => this.addField(name, field));
    }

    public typeInherits(child: string, parent: string) {
        if (!this.types[child]) {
            throw new Error(`Child type "${child}" does not exist`);
        }

        if (!this.types[parent]) {
            throw new Error(`Parent type "${parent}" does not exist`);
        }

        if (this.types[child].implementedTypes.indexOf(parent) >= 0) {
            throw new Error(`Child "${child}" already implements parent "${parent}"`);
        }

        this.types[child].implementedTypes.push(parent);
    }

    public implementComputed(type: string, fieldName: string, f: (content: EntityContent) => EntityContentValue) {
        if (!this.types[type]) {
            throw new Error(`Type "${type}" does not exist`);
        }

        const field: undefined | TypeField = this.types[type].fields.find(({name}) => name === fieldName);

        if (!field) {
            throw new Error(`Type "${parent}" does not have type "${fieldName}"`);
        }

        if (!field.computed) {
            throw new Error(`Field "${parent}"."${fieldName}" is not a computed field`);
        }

        field.impl = f;
    }

    public build(): TypeManager {
        const completed: Set<string> = new Set();
        const nameList = Object.keys(this.types);

        nameList.forEach(name => this.buildTypeImplemented(completed, name));
        nameList.forEach(name => {
            this.types[name].implementedTypes.forEach(parentName => {
                const parentType = this.types[parentName];
                if (parentType.extendedBy.indexOf(name) < 0) {
                    parentType.extendedBy.push(name);
                    parentType.implementedBy.push(name);
                }
            });
        });

        return new TypeManager(this.types);
    }

    private buildTypeImplemented(completed: Set<string>, name: string): void {
        if (completed.has(name)) {
            return;
        }

        completed.add(name);

        const type = this.types[name];
        const additionalParents: string[] = [];

        type.implementedTypes.forEach(parent => {
            if (!completed.has(parent)) {
                this.buildTypeImplemented(completed, parent);
            }

            const parentType = this.types[parent];
            this.extendType(name, parentType.fields);
            parentType.implementedTypes.forEach(additionalParent => {
                additionalParents.push(additionalParent);
            });
        });

        additionalParents.forEach(additionalParent => {
            if (type.implementedTypes.indexOf(additionalParent) < 0) {
                type.implementedTypes.push(additionalParent);
            }
        });
    }

    private createType(name: string, canCreate: boolean, fields: TypeField[]) {
        if (this.types[name]) {
            throw new Error(`Type "${name}" already exists`);
        }

        this.types[name] = {
            canCreate,
            extendedBy: [],
            fieldMap: {},
            fields: [],
            implementedBy: [name],
            implementedTypes: [],
        };

        this.extendType(name, fields);
    }

    private addField(typeName: string, field: TypeField): void {
        if (!this.types[typeName]) {
            throw new Error(`Type "${name}" does not exist`);
        }

        if (this.types[typeName].fieldMap[field.name]) {
            throw new Error(`Type "${typeName}" already has field "${field.name}"`);
        }

        this.types[typeName].fieldMap[field.name] = field;
        this.types[typeName].fields.push(field);
    }
}
