import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {SiteTreeData, SiteTreeNode, SiteTreeStore} from "../../../common/bundles/site-tree/site-tree-data";
import {RenderingCache} from "../../orm/server-cache";
import {EntityFinderError} from "../entity-finder/entity-finder-error";
import {SiteTreeError} from "./site-tree-error";
import {syncBuildNode} from "../../../common/bundles/site-tree/sync-build-site-node";

export class ServerSiteTreeStore implements SiteTreeStore {
    private cache: RenderingCache;
    private entityFinder: EntityFinderStore;
    private treeCache: { [id: string]: SiteTreeNode[] } = {};

    constructor(cache: RenderingCache, entityFinder: EntityFinderStore) {
        this.cache = cache;
        this.entityFinder = entityFinder;
    }

    public getTree(open: number[]): SiteTreeData {
        const id = open.join(",");
        let data = this.treeCache[id];

        if (!data) {
            data = this.syncBuildSiteTree(id, open);
            this.treeCache[id] = data;
        }

        return {
            data: this.treeCache[id],
            loading: false,
        };
    }

    private syncBuildSiteTree(id: string, open: number[]): SiteTreeNode[] {
        try {
            const sites = this.entityFinder.find("sites", {_type: "site"}).data;
            return sites.map(site => syncBuildNode(open, null, site));
        } catch (err) {
            const entityFinderErr = err instanceof EntityFinderError ? err as EntityFinderError : null;
            throw new SiteTreeError(id, open, this.treeCache, this.entityFinder, entityFinderErr);
        }
    }
}
