import {inject, observer} from "mobx-react";
import * as React from "react";
import {Icon} from "../icon/icon";
import {iconActionClassName, IconActionProps, iconActionProps} from "./icon-action";

@inject<IconActionProps>("location")
@observer
export class IconButton extends React.Component<IconActionProps> {
    public render() {
        return (
            <button {...iconActionProps(this.props)}
                    className={iconActionClassName("icon-button", this.props)}>
                <Icon name={this.props.name}/>
            </button>
        );
    }
}
