import * as React from "react";
import {LocationStore} from "../../bundles/location/location-data";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";
import {SiteTree} from "./site-tree-view/site-tree";
import {Icon, MainLayout, Splitter} from "./widgets";

export interface AdminMainProps {
    resolvedPage: ResolvedPageData;
    location: LocationStore;
}

export class AdminMain extends React.Component<AdminMainProps> {
    public render() {
        return (
            <MainLayout>
                <AdminHead/>
                <Splitter>
                    <div><SiteTree/></div>
                    <div>2</div>
                </Splitter>
            </MainLayout>
        );
    }
}
