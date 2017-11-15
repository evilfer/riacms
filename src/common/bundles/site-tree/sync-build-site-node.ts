import {SiteTreeNode} from "./site-tree-data";

export function syncBuildNode(open: number[], link: any | null, entity: any = link.child): SiteTreeNode {
    const loadChildren = open.indexOf(entity._id) >= 0;
    const children = loadChildren ?
        (entity.childLinks || []).map((childLink: any) => syncBuildNode(open, childLink)) : null;

    return {
        children,
        entity,
        link,
    };
}
