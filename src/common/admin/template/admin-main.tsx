import * as React from "react";
import {Header} from "semantic-ui-react";
import {LocationStore} from "../../bundles/location/location-data";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";
import {SiteTree} from "./site-tree-view/site-tree";
import {QueryTabMenu} from "./widgets/nav/query-tab-menu";
import {QueryNavWrapper} from "./widgets/nav/qurery-nav-wrapper";
import {SiteTreeView} from "./site-tree-view/site-tree-view";

export interface AdminMainProps {
    resolvedPage: ResolvedPageData;
    location: LocationStore;
}

export class AdminMain extends React.Component<AdminMainProps> {
    public render() {
        const tabs = [
            {value: null, label: "Site tree"},
            {value: "finder", label: "Entity search"},
        ];

        const mainContent = {
            "": () => <SiteTreeView/>,
            "finder": () => <div>finder</div>,
        };

        return (
            <div>
                <AdminHead/>
                <Header as="h1">Hello World</Header>
                <QueryTabMenu param="mv" tabs={tabs}/>
                <QueryNavWrapper param="mv" content={mainContent}/>
            </div>
        );
    }
}
