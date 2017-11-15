import {observer} from "mobx-react";
import * as React from "react";
import {LocationStore} from "../../../../bundles/location/location-data";
import {gotoQuery} from "../../../../bundles/location/location-utils";
import {ResolvedPageData} from "../../../../bundles/page-resolver/resolved-page-data";
import {SiteTreeNode, SiteTreeStore} from "../../../../bundles/site-tree/site-tree-data";
import {TypeManager} from "../../../../types/type-manager";
import {Tree, TreeDataItem} from "../../widgets/tree/tree";
import {currentEntityI, CurrentEntityProps} from "../base-components/current-entity";

export interface SiteTreeProps extends CurrentEntityProps {
    location?: LocationStore;
    resolvedPage?: ResolvedPageData;
    siteTree?: SiteTreeStore;
    types?: TypeManager;
}

function buildSiteTreeData(location: LocationStore, nodes: SiteTreeNode[]): TreeDataItem[] {
    return nodes.map(node => {
        const children = node.children ? buildSiteTreeData(location, node.children) : null;

        return {
            children,
            key: node.entity._id,
            label: `${node.entity.name} (${node.entity._id})`,
            menu: () => [
                {
                    icon: "pencil",
                    label: "Edit",
                    onClick: () => {
                        gotoQuery(location, {
                            eid: node.entity._id,
                            ev: null,
                        }, false);
                    },
                },
                {
                    icon: "plus",
                    label: "New page",
                    onClick: () => {
                        gotoQuery(location, {
                            eid: node.entity._id,
                            ev: "new-page",
                        }, false);
                    },
                },
                {
                    icon: "remove",
                    label: "Delete page",
                    onClick: () => {
                        gotoQuery(location, {
                            eid: node.entity._id,
                            ev: "delete",
                        }, false);
                    },
                },
            ],
        };
    });
}

@currentEntityI("types", "resolvedPage", "location", "siteTree")
@observer
export class SiteTree extends React.Component<SiteTreeProps> {
    public render() {
        const {types, resolvedPage, location, siteTree, currentEntity} = this.props;
        const entityIsPage = currentEntity!.entity && types!.isA(currentEntity!.entity, "site_tree_parent");

        const openIds = [
            ...resolvedPage!.site ? [resolvedPage!.site._id] : [],
            ...resolvedPage!.route.slice(0, -1).map(({_id}) => _id),
        ];

        if (entityIsPage) {
            // add to defaultOpen
        }

        const sto = location!.query.get("sto");
        const siteTreeQueryIds = (sto ? sto.split(",") : []).map(id => parseInt(id, 10));

        const queryOpenIds = siteTreeQueryIds.filter(v => v > 0);
        const queryClosedIds = siteTreeQueryIds.filter(v => v < 0).map(v => -v);

        queryOpenIds.forEach(id => {
            if (openIds.indexOf(id) < 0) {
                openIds.push(id);
            }
        });

        queryClosedIds.forEach(id => {
            const index = openIds.indexOf(id);
            if (index >= 0) {
                openIds.splice(index, 1);
            }
        });

        const siteTreeData = siteTree!.getTree(openIds);

        const treeItems: TreeDataItem[] = buildSiteTreeData(location!, siteTreeData.data);
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
