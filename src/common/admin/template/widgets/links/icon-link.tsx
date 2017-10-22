import {inject, observer} from "mobx-react";
import * as React from "react";
import {Icon} from "../icon/icon";
import {iconActionClassName, IconActionProps, iconActionProps} from "./icon-action";
import {Link} from "./link";

@inject<IconActionProps>("location")
@observer
export class IconLink extends React.Component<IconActionProps> {
    public render() {
        return (
            <Link {...iconActionProps(this.props)}
                  className={iconActionClassName("icon-button", this.props)}>
                <Icon name={this.props.name}/>
            </Link>
        );
    }
}
