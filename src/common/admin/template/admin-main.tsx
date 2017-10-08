import * as React from "react";
import {LocationStore} from "../../bundles/location/location-data";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";
import {MainLayout, Splitter} from "./widgets";

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
                    <div>1</div>
                    <div>2</div>
                </Splitter>
            </MainLayout>
        );
    }
}
