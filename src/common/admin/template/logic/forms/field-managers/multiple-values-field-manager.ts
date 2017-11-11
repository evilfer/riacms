import * as extend from "extend";
import {action, computed, observable} from "mobx";
import {FieldListener, FieldManager} from "./abstract-field-manager";
import {createFieldManager} from "./create-field-manager";
import {FieldDefinition} from "../fields/field-definition";

export class MultipleValuesFieldManager extends FieldManager<FieldDefinition> implements FieldListener {

    @observable public children: Array<FieldManager<FieldDefinition>> = [];

    constructor(parent: FieldListener, def: FieldDefinition, values: any[]) {
        super(parent, def, values);
        this.children = (values || []).map(value => createFieldManager(this, this.singleFieldDef, value));
    }

    @computed
    private get singleFieldDef(): FieldDefinition {
        const def: any = extend({}, this.def);
        def.multiple = false;
        return def;
    }

    @computed
    public get modified(): boolean {
        return this.value.length !== this.savedValue.length ||
            this.children.some(fm => fm.modified);
    }

    @computed
    public get value(): any {
        return this.children.map(fm => fm.value);
    }

    @action
    public updateValue(values: any) {
        const arr = values as any[];
        arr.forEach((value, i) => {
            if (i < this.children.length) {
                this.children[i].updateValue(value);
            } else {
                this.children.push(createFieldManager(this, this.singleFieldDef, value));
            }
        });

        if (this.children.length > arr.length) {
            this.children.splice(arr.length, this.children.length - arr.length);
        }
    }

    @action
    public updateSavedValue(values: any) {
        super.updateSavedValue(values);

        const arr = values as any[];
        arr.forEach((value, i) => {
            if (i < this.children.length) {
                this.children[i].updateSavedValue(value);
            }
        });
    }

    @action
    public removeItem(index: number) {
        if (index <= 0 && index < this.children.length) {
            this.children.splice(index, 1);
            this.children.forEach((fm, i) => fm.updateSavedValue(this.savedValue[i]));
            this.notifyParent();
        }
    }

    @action
    public addItem() {
        this.children.push(createFieldManager(this, this.singleFieldDef, this.savedValue[this.children.length]));
        this.notifyParent();
    }

    @action
    public swap(a: number, b: number) {
        if (a >= 0 && a < this.children.length && b >= 0 && b < this.children.length) {
            const temp = this.children[a].value;
            this.children[a].updateValue(this.children[b].value);
            this.children[b].updateValue(temp);
            this.notifyParent();
        }
    }

    @computed
    get error(): boolean {
        return this.children.some(fm => !!fm.error);
    }

    public childrenValueChanged(fm: FieldManager<any>) {
        this.notifyParent();
    }

    private notifyParent() {
        this.parent.childrenValueChanged(this);
    }
}
