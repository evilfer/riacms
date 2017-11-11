import * as React from "react";
import {LiteralInputProps} from "./input-props";
import {observer} from "mobx-react";

@observer
export class InputText extends React.Component<LiteralInputProps> {
    public render() {
        const {id, fm} = this.props;

        return <input type="text"
                      id={id}
                      name={fm.def.name}
                      value={fm.value || ""}
                      onChange={evt => fm.setValue(evt.target.value)}/>;
    }
}
