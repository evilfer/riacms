import * as classNames from "classnames";
import * as React from "react";
import {objectMinus} from "../../../../utils/object-minus";

export interface IconProps extends React.DOMAttributes<any> {
    name: string;
    spin?: boolean;
}

export class Icon extends React.Component<IconProps> {
    public render() {
        const htmlProps = objectMinus(this.props, "name", "spin");

        return <span {...htmlProps}
                     aria-hidden="true"
                     className={classNames("fa", `fa-${this.props.name}`, {
                         "fa-spin": this.props.spin,
                     })}/>;
    }
}
