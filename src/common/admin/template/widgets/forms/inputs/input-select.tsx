import {observer} from "mobx-react";
import * as React from "react";
import {LiteralValueSingleFieldManager} from "../../../logic/forms/field-managers/literal-single-field-manager";
import {InputProps} from "./input-props";

@observer
export class InputSelect extends React.Component<InputProps<LiteralValueSingleFieldManager>> {
    public render() {
        const {fieldId, fm} = this.props;
        const options = fm.def.presentation.options || [];
        const optionElements = options.map(({label, value}) => (
            <option key={value} value={value}>{label}</option>
        ));

        return (
            <select id={fieldId}
                    name={fm.def.name}
                    value={fm.value || ""}
                    onChange={evt => fm.setValue(evt.target.value)}>
                {optionElements}
            </select>
        );
    }
}
