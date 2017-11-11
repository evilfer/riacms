import {FieldManager} from "../field-managers/abstract-field-manager";

export interface FieldPresentation {
    label: string;
    description: string;
    input: "text" | "textarea" | "number" | "select" | "checkbox" | "picker" | "nested";
    validation?: ((fm: FieldManager<any>) => null | undefined | boolean | string);
    options?: Array<{ label: string, value: string }>;
}
