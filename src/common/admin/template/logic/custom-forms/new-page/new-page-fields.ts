import {FieldDefinition} from "../../forms/fields/field-definition";
import {TypeManager} from "../../../../../types/type-manager";

export function newPageFields(types: TypeManager): FieldDefinition[] {
    return [{
        multiple: false,
        name: "type",
        presentation: {
            description: "New page type",
            input: "select",
            label: "Type",
            options: types.getImplementedBy("page").map(type => ({label: type, value: type})),
            validation: fm => !fm.value && "Type cannot be empty" || null,
        },
        type: "string",
    }, {
        multiple: false,
        name: "name",
        presentation: {
            description: "New page name",
            input: "text",
            label: "Name",
            validation: fm => !fm.value && "Name cannot be empty" || null,
        },
        type: "string",
    }, {
        multiple: false,
        name: "path",
        presentation: {
            description: "New page path",
            input: "text",
            label: "Path",
            validation: fm =>
                (!fm.value && "Path cannot be empty") ||
                (!fm.value.match(/^[a-zA-Z0-9_\-]*$/) &&
                    "Path must contain only alphanumeric characters, \"-\" and \"_\".") || null,
        },
        type: "string",
    }];
}
