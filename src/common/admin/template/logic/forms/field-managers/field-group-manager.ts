import {action, computed, observable} from "mobx";
import {FieldDefinition} from "../fields/field-definition";
import {FieldListener, FieldManager} from "./abstract-field-manager";
import {createFieldManager} from "./create-field-manager";

export class FieldGroupManager implements FieldListener {
    @observable public fields: Array<FieldManager<any>>;
    @observable public fieldMap: Map<string, FieldManager<any>>;

    constructor(fields: FieldDefinition[], values: { [key: string]: any }) {
        this.fields = fields.map(field => createFieldManager(this, field, values[field.name]));
        this.fieldMap = this.fields.reduce((acc, fm) => {
            acc.set(fm.def.name, fm);
            return acc;
        }, new Map<string, FieldManager<any>>());
    }

    @computed
    public get modified(): boolean {
        return this.fields.some(fm => fm.modified);
    }

    @computed
    public get value(): any {
        return this.fields.reduce((acc, fm) => {
            acc[fm.def.name] = fm.value;
            return acc;
        }, {} as { [name: string]: any });
    }

    @action
    public updateValues(values: any) {
        this.fields.forEach(fm => fm.updateValue(values[fm.def.name]));
    }

    @action
    public updateSavedValues(values: any) {
        this.fields.forEach(fm => fm.updateSavedValue(values[fm.def.name]));
    }

    public childrenValueChanged(fm: FieldManager<any>): void {
        return;
    }

    @computed
    get error(): boolean {
        return this.fields.some(fm => !!fm.error);
    }
}
