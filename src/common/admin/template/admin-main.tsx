import {DatePicker} from "antd";

import {inject} from "mobx-react";
import * as React from "react";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {AdminHead} from "./admin-head";

export class AdminMain extends React.Component<{ resolvedPage: ResolvedPageData }> {
    public render() {
        return (
            <div>
                <AdminHead/>
                hello world!!
                <DatePicker/>
            </div>
        );
    }
}

export const WrappedAdminMain = inject<{ resolvedPage: ResolvedPageData }>("resolvedPage")(AdminMain);
