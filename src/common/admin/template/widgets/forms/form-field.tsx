import * as React from "react";
import {FieldManager} from "../../logic/forms/field-managers/abstract-field-manager";
import {LiteralValueSingleFieldManager} from "../../logic/forms/field-managers/literal-single-field-manager";
import {InputText} from "./inputs/input-text";
import {InputSelect} from "./inputs/input-select";
import {observer} from "mobx-react";
import {Input} from "./inputs/input";

export interface FormFieldProps {
    baseId: string;
    fm: FieldManager<any>;
}



@observer
export class FormField extends React.Component<FormFieldProps> {
    public render() {
        const {fm, baseId} = this.props;
        const fieldId = `${baseId}${baseId ? ":" : ""}${fm.def.name}`;
        const error = fm.error && <div className="form-field__error">{fm.error}</div>;

        return (
            <div className="form-field">
                <label htmlFor={fieldId}>{fm.def.presentation.label}</label>
                <Input fieldId={fieldId} fm={fm}/>
                {error}
            </div>
        );
    }
}
