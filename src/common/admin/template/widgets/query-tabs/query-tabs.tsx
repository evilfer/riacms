import {inject, observer} from "mobx-react";
import * as React from "react";
import {LocationStore} from "../../../../bundles/location/location-data";
import {gotoQuery, queryPath} from "../../../../bundles/location/location-utils";
import {Tabs} from "../tabs/tabs";

export interface QueryTabData {
    icon?: string;
    label: string;
    value: null | string;
}

export interface QueryTabsProps {
    param: string;
    tabs: QueryTabData[];
    location?: LocationStore;
}

@inject("location")
@observer
export class QueryTabs extends React.Component<QueryTabsProps> {

    public handleSelect(value: null | string) {
        gotoQuery(this.props.location!, {[this.props.param]: value}, false);
    }

    public render() {
        const {param, tabs, location} = this.props;
        const currentValue = location!.query.get(param) || null;
        const widgetTabs = tabs.map(({icon, label, value}) => ({
            action: queryPath(this.props.location!, {[this.props.param]: value}, false),
            active: value === currentValue,
            icon,
            label,
        }));

        return <Tabs tabs={widgetTabs}/>;
    }
}
