import {observer} from "mobx-react";
import * as React from "react";
import {LiteralValueSingleFieldManager} from "../../../logic/forms/field-managers/literal-single-field-manager";
import {InputProps} from "./input-props";

@observer
export class InputText extends React.Component<InputProps<LiteralValueSingleFieldManager>> {
    public render() {
        const {fieldId, fm} = this.props;

        return <input type="text"
                      id={fieldId}
                      name={fm.def.name}
                      value={fm.value || ""}
                      onChange={evt => fm.setValue(evt.target.value)}/>;
    }
}
