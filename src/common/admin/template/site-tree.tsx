import {inject, observer} from "mobx-react";
import * as React from "react";
import {EntityFinderStore} from "../../bundles/entity-finder/entity-finder-data";
import {LocationStore} from "../../bundles/location/location-data";
import {gotoQuery} from "../../bundles/location/location-utils";
import {ResolvedPageData} from "../../bundles/page-resolver/resolved-page-data";
import {Tree, TreeDataItem} from "./widgets/tree/tree";

export interface SiteTreeProps {
    location?: LocationStore;
    entityFinder?: EntityFinderStore;
    resolvedPage?: ResolvedPageData;
}

function buildSiteTreeData(nodes: any[], openIds: number[]): TreeDataItem[] {
    return nodes.map(node => {
        const children = openIds.indexOf(node._id) >= 0 ?
            buildSiteTreeData(node.childLinks.map((link: any) => link.child), openIds) : null;

        return {
            children,
            key: node._id,
            label: node.name,
        };
    });
}

@inject("entityFinder", "resolvedPage", "location")
@observer
export class SiteTree extends React.Component<SiteTreeProps> {
    public render() {
        const {entityFinder, resolvedPage, location} = this.props;

        const sites = entityFinder!.find("sites", {_type: "site"}).data;

        const sto = location!.query.get("sto");
        const siteTreeQueryIds = (sto ? sto.split(",") : []).map(id => parseInt(id, 10));

        const queryOpenIds = siteTreeQueryIds.filter(v => v > 0);
        const queryClosedIds = siteTreeQueryIds.filter(v => v < 0).map(v => -v);

        const defaultOpenIds = [
            resolvedPage!.site ? resolvedPage!.site._id : -1,
            ...resolvedPage!.route.slice(0, -1).map(({_id}) => _id),
        ];

        const openIds = [
            ...defaultOpenIds,
            ...queryOpenIds.filter(v => v > 0),
        ].filter(v => queryClosedIds.indexOf(v) < 0);

        const treeItems: TreeDataItem[] = buildSiteTreeData(sites, openIds);
        const onChange = (id: number, open: boolean) => {
            if (open) {
                const ci = queryClosedIds.indexOf(id);
                if (ci >= 0) {
                    queryClosedIds.splice(ci, 1);
                }

                if (queryOpenIds.indexOf(id) < 0) {
                    queryOpenIds.push(id);
                }
            } else {
                const oi = queryOpenIds.indexOf(id);
                if (oi >= 0) {
                    queryOpenIds.splice(oi, 1);
                }

                if (queryClosedIds.indexOf(id) < 0) {
                    queryClosedIds.push(id);
                }
            }

            gotoQuery(location!, {
                sto: [...queryOpenIds, ...queryClosedIds.map(v => -v)].join(","),
            }, false);
        };
        return (
            <div>
                <Tree items={treeItems}
                      onChange={onChange}/>
            </div>
        );
    }
}
