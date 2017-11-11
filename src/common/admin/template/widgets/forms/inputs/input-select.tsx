import {observer} from "mobx-react";
import * as React from "react";
import {LiteralInputProps} from "./input-props";

@observer
export class InputSelect extends React.Component<LiteralInputProps> {
    public render() {
        const {id, fm} = this.props;
        const options = fm.def.presentation.options || [];
        const optionElements = options.map(({label, value}) => (
            <option key={value} value={value}>{label}</option>
        ));

        return (
            <select id={id}
                    name={fm.def.name}
                    value={fm.value || ""}
                    onChange={evt => fm.setValue(evt.target.value)}>
                {optionElements}
            </select>
        );
    }
}
