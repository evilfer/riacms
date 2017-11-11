import {action, observable} from "mobx";
import {FieldDefinition} from "../fields/field-definition";

export interface FieldListener {
    childrenValueChanged: (fm: FieldManager<any>) => void;
}

export abstract class FieldManager<T extends FieldDefinition> {
    @observable public def: T;
    @observable protected savedValue: any;
    protected parent: FieldListener;

    constructor(parent: FieldListener, def: T, value: any) {
        this.parent = parent;
        this.def = def;
        this.savedValue = value;
    }

    @action
    public updateSavedValue(value: any) {
        this.savedValue = value;
    }

    public abstract get error(): string | boolean | null | undefined;

    public abstract get value(): any;

    public abstract updateValue(value: any): void;

    public abstract get modified(): boolean;
}
