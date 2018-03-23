import * as React from "react";
import {LocationStore} from "../../bundles/location/location-data";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";
import {MainLayout} from "./sections/main-layout/main-layout";
import {SiteTreeView} from "./sections/site-tree/site-tree-view";
import {QueryNavWrapper} from "./widgets";

export interface AdminMainProps {
    resolvedPage: ResolvedPageData;
    location: LocationStore;
}

const TAB_CONTENT: { [value: string]: () => JSX.Element } = {
    "": () => <SiteTreeView/>,
    "search": () => <div>search</div>,
};

export class AdminMain extends React.Component<AdminMainProps> {
    public render() {
        return (
            <MainLayout>
                <AdminHead/>
                <QueryNavWrapper param="mv" content={TAB_CONTENT}/>
            </MainLayout>
        );
    }
}
