import {inject, observer} from "mobx-react";
import * as React from "react";
import {LocationStore} from "../../../../bundles/location/location-data";

export interface LinkProps extends React.AllHTMLAttributes<any> {
    location?: LocationStore;
}

@inject<LinkProps>("location")
@observer
export class Link extends React.Component<LinkProps> {
    public render() {
        const {href, location} = this.props;
        const onClick = href && ((evt: any) => {
            evt.preventDefault();
            location!.goto(href);
        }) || undefined;

        return <a {...this.props} onClick={onClick}/>;
    }
}
