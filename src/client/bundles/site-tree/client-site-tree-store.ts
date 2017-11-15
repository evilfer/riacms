import {observable} from "mobx";
import {
    EntityFinderStore,
} from "../../../common/bundles/entity-finder/entity-finder-data";
import {SiteTreeData, SiteTreeNode, SiteTreeStore} from "../../../common/bundles/site-tree/site-tree-data";
import {syncBuildNode} from "../../../common/bundles/site-tree/sync-build-site-node";
import {ClientCache} from "../../cache/client-cache";
import {ClientSiteTreeError} from "./client-site-tree-error";

export class ClientSiteTreeStore implements SiteTreeStore {
    private cache: ClientCache;
    private entityFinder: EntityFinderStore;

    private failedTrees: string[] = [];

    @observable.shallow
    private treeCache: Map<string, SiteTreeNode[]> = new Map();

    public constructor(cache: ClientCache, entityFinder: EntityFinderStore) {
        this.cache = cache;
        this.entityFinder = entityFinder;
    }

    public getTree(open: number[]): SiteTreeData {
        const sites = this.entityFinder.find("sites", {_type: "site"});
        if (!sites.data) {
            return {loading: true, data: []};
        }

        return {
            data: sites.data.map(site => syncBuildNode(open, null, site)),
            loading: false,
        };
    }

    public getError(): null | ClientSiteTreeError {
        if (this.failedTrees.length === 0) {
            return null;
        }

        const error = new ClientSiteTreeError(this.failedTrees);
        this.failedTrees = [];
        return error;
    }
}
