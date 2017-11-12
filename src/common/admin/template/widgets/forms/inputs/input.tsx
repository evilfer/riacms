import * as React from "react";
import {FieldManager} from "../../../logic/forms/field-managers/abstract-field-manager";
import {LiteralValueSingleFieldManager} from "../../../logic/forms/field-managers/literal-single-field-manager";
import {MultipleValuesFieldManager} from "../../../logic/forms/field-managers/multiple-values-field-manager";
import {InputMultiple} from "./input-multiple";
import {InputProps} from "./input-props";
import {InputSelect} from "./input-select";
import {InputText} from "./input-text";

export function Input({fieldId, fm}: InputProps<FieldManager<any>>): JSX.Element {
    if (fm.def.multiple) {
        return <InputMultiple fieldId={fieldId} fm={fm as MultipleValuesFieldManager}/>;
    }

    switch (fm.def.presentation.input) {
        case "text":
            return <InputText fieldId={fieldId} fm={fm as LiteralValueSingleFieldManager}/>;
        case "select":
            return <InputSelect fieldId={fieldId} fm={fm as LiteralValueSingleFieldManager}/>;
        default:
            return <div>bad field</div>;
    }
}
