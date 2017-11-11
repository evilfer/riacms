import {observer} from "mobx-react";
import * as React from "react";
import {FormEvent} from "react";
import {FormManager} from "../../logic/forms/form-manager";
import {FormField} from "./form-field";
import {LoadingIndicator} from "../loading-indicator/loading-indicator";

export interface FormProps {
    formManager: FormManager;
}

@observer
export class Form extends React.Component<FormProps> {
    public render() {
        const {formManager} = this.props;

        return (
            <form method={formManager.method} action={formManager.action}
                  onSubmit={evt => this.handleSubmit(evt)}>
                <LoadingIndicator loading={formManager.submitting}/>
                {formManager.fields.map(fm => <FormField key={fm.def.name} baseId={formManager.id} fm={fm}/>)}
                <button type="submit">submit</button>
            </form>
        );
    }

    private handleSubmit(evt: FormEvent<any>) {
        evt.preventDefault();
        this.props.formManager.submit();
    }
}
