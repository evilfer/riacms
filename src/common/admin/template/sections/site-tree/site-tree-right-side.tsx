import * as React from "react";
import {QueryNavWrapper} from "../../widgets/query-tabs/qurery-nav-wrapper";
import {EntityNewPage} from "../entity/entity-new-page";
import {EntityHome} from "../entity/entity-home";

const TAB_CONTENT: { [value: string]: () => JSX.Element } = {
    "": () => <EntityHome/>,
    "delete": () => <div>delete</div>,
    "new-page": () => <EntityNewPage/>,
    "new-site": () => <div>new site</div>,
};

export class SiteTreeRightSide extends React.Component<{}> {
    public render() {
        return <QueryNavWrapper param="ev" content={TAB_CONTENT}/>;
    }
}
