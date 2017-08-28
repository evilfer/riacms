import * as React from "react";
import {Header, Tab} from "semantic-ui-react";
import {LocationStore} from "../../bundles/location/location-data";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";
import {SiteTree} from "./site-tree";
import {QueryTabMenu} from "./widgets/tabs/query-tab-menu";

export interface AdminMainProps {
    resolvedPage: ResolvedPageData;
    location: LocationStore;
}

export class AdminMain extends React.Component<AdminMainProps> {
    public render() {
        const tabs = [
            { value: null, label: "Site tree" },
            { value: "finder", label: "Entity search" },
        ];

        return (
            <div>
                <AdminHead/>
                <Header as="h1">Hello World</Header>
                <QueryTabMenu param="mv" tabs={tabs}/>
                <SiteTree/>
            </div>
        );
    }
}
