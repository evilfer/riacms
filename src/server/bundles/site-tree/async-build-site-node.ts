import * as Promise from "bluebird";
import {SiteTreeNode} from "../../../common/bundles/site-tree/site-tree-data";
import {RenderingCache} from "../../orm/server-cache";

function noop(_: any): void {
    return;
}

function buildChildren(cache: RenderingCache, open: number[], nodeProxy: any): Promise<null | SiteTreeNode[]> {
    if (open.indexOf(nodeProxy._id) < 0) {
        return Promise.resolve(null);
    }

    return cache.loadEntity(nodeProxy._id)
        .then(({content}) => cache.loadEntities((content.childLinks || []) as number[]))
        .then(links => Promise.map(links, link => cache.loadEntity(link.content.child as number)
            .then(child => {
                noop(link.proxy.child);
                return asyncBuildNode(cache, open, link.proxy, child.proxy);
            })))
        .then((result: null | SiteTreeNode[]) => {
            noop(nodeProxy.childLinks);
            return result;
        });
}

export function asyncBuildNode(cache: RenderingCache,
                               open: number[],
                               linkProxy: any | null,
                               entityProxy: any): Promise<SiteTreeNode> {

    return buildChildren(cache, open, entityProxy)
        .then(children => ({
            children,
            entity: entityProxy,
            link: linkProxy,
        }));
}
