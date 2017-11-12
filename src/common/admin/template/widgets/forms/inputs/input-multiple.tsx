import {observer} from "mobx-react";
import * as React from "react";
import {MultipleValuesFieldManager} from "../../../logic/forms/field-managers/multiple-values-field-manager";
import {IconButton} from "../../links/icon-button";
import {Input} from "./input";
import {InputProps} from "./input-props";

function wrapAction(action: () => void) {
    return (evt: React.FormEvent<any>) => {
        evt.preventDefault();
        action();
    };
}

@observer
export class InputMultiple extends React.Component<InputProps<MultipleValuesFieldManager>> {
    public render() {
        const {fieldId, fm} = this.props;
        const childElements = fm.children.map((childFm, i) => {
            const childFieldId = `${fieldId}:${i}`;

            return (
                <li key={i}>
                    <Input fieldId={childFieldId} fm={childFm}/>
                    <IconButton name="arrow-down"
                                onClick={wrapAction(() => fm.swap(i, i + 1))}/>
                    <IconButton name="arrow-up"
                                onClick={wrapAction(() => fm.swap(i, i - 1))}/>
                    <IconButton name="close"
                                onClick={wrapAction(() => fm.removeItem(i))}/>
                </li>
            );
        });

        return (
            <div>
                <ul>
                    {childElements}
                </ul>
                <IconButton name="plus"
                            onClick={wrapAction(() => fm.addItem())}/>
            </div>
        );
    }
}
