import * as React from "react";

export class Menu extends React.Component<{}> {
    public render() {
        return <div className="menu">{this.props.children}</div>;
    }
}
