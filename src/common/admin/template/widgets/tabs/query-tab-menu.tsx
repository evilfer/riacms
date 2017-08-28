import {inject, observer} from "mobx-react";
import * as React from "react";
import {Menu} from "semantic-ui-react";
import {LocationStore} from "../../../../bundles/location/location-data";
import {gotoQuery} from "../../../../bundles/location/location-utils";

export interface QueryTabMenuProps {
    param: string;
    tabs: Array<{ label: string, value: null | string }>;
    location?: LocationStore;
}

@inject<QueryTabMenuProps>("location")
@observer
export class QueryTabMenu extends React.Component<QueryTabMenuProps> {

    public handleSelect(value: null | string) {
        gotoQuery(this.props.location!, {[this.props.param]: value}, false);
    }

    public render() {
        const {param, tabs, location} = this.props;
        const currentValue = location!.query.get(param) || null;

        const items = tabs.map(({label, value}) => (
            <Menu.Item name={value || ""}
                       key={value || ""}
                       active={value === currentValue}
                       onClick={() => this.handleSelect(value)}>{label}</Menu.Item>
        ));

        return <Menu pointing secondary>{items}</Menu>;
    }
}
