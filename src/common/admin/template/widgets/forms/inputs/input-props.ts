import {FieldManager} from "../../../logic/forms/field-managers/abstract-field-manager";

export interface InputProps<T extends FieldManager<any>> {
    fieldId: string;
    fm: T;
}
