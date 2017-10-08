import * as React from "react";

export interface IconProps extends React.DOMAttributes<any> {
    name: string;
}

export default class Icon extends React.Component<IconProps> {
    public render() {
        return <span className={`fa fa-${this.props.name}`}
                     aria-hidden="true"
                     {...this.props}/>;
    }
}
