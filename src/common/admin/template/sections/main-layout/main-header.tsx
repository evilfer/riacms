import * as React from "react";
import {Icon, QueryTabData, QueryTabs} from "../../widgets";

const TABS: QueryTabData[] = [
    {icon: "tree", label: "Site tree", value: null},
    {icon: "search", label: "Search", value: "search"},
];

export class MainHeader extends React.Component<{}> {
    public render() {
        return (
            <div>
                <Icon name="rocket"/>
                <QueryTabs param="mv" tabs={TABS}/>
            </div>
        );
    }
}
