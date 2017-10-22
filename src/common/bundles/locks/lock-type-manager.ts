import {TypeManager} from "../../types/type-manager";

export interface LockDefinition {
    id: string;
    type: string;
    fields: string[];
}

export interface LockInstance {
    id: string;
    eid: number;
}

export class LockTypeManager {
    private types: TypeManager;
    private definitions: { [id: string]: LockDefinition };

    constructor(types: TypeManager, definitions: LockDefinition[]) {
        this.types = types;
        this.definitions = definitions.reduce((acc, definition) => {
            acc[definition.id] = definition;
            return acc;
        }, {} as { [id: string]: LockDefinition });
    }


}
