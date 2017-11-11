import {action, computed, observable} from "mobx";
import {LiteralFieldDefinition} from "../fields/field-definition";
import {FieldListener, FieldManager} from "./abstract-field-manager";

export class LiteralValueSingleFieldManager extends FieldManager<LiteralFieldDefinition> {
    @computed
    public get error(): string | boolean | null | undefined {
        return this.def.presentation.validation && this.def.presentation.validation(this);
    }

    @observable public value: any;

    constructor(parent: FieldListener, def: LiteralFieldDefinition, value: any) {
        super(parent, def, value);
        this.value = value;
    }

    @computed
    public get modified(): boolean {
        return this.value !== this.savedValue;
    }

    @action
    public updateValue(value: any): void {
        this.value = value;
    }

    @action
    public setValue(value: any): void {
        this.value = value;
        this.parent.childrenValueChanged(this);
    }
}
