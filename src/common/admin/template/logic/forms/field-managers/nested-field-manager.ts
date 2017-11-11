import {action, computed} from "mobx";
import {NestedFieldDefinition} from "../fields/field-definition";
import {FieldListener, FieldManager} from "./abstract-field-manager";
import {FieldGroupManager} from "./field-group-manager";

export class NestedFieldManager extends FieldManager<NestedFieldDefinition> implements FieldListener {
    public groupManager: FieldGroupManager;

    constructor(parent: FieldListener, def: NestedFieldDefinition, value: any) {
        super(parent, def, value);

        this.groupManager = new FieldGroupManager(def.nestedFields, value);
    }

    @computed
    public get value() {
        return this.groupManager.value;
    }

    @computed
    public get modified(): boolean {
        return this.groupManager.modified;
    }

    @action
    public updateValue(value: any): void {
        this.groupManager.updateValues(value);
    }

    @action
    public updateSavedValue(value: any): void {
        super.updateSavedValue(value);
        this.groupManager.updateValues(value);
    }

    public childrenValueChanged(fm: FieldManager<any>) {
        this.parent.childrenValueChanged(this);
    }

    @computed
    get error(): boolean {
        return this.groupManager.error;
    }

}
