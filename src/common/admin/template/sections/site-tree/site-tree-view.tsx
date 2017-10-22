import * as React from "react";
import {Splitter} from "../../widgets";
import {SiteTree} from "./site-tree";
import {SiteTreeRightSide} from "./site-tree-right-side";

export class SiteTreeView extends React.Component<{}> {
    public render() {
        return (
            <Splitter id="site-tree">
                <SiteTree/>
                <SiteTreeRightSide/>
            </Splitter>
        );
    }
}
