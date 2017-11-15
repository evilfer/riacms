import * as Promise from "bluebird";
import {EntityFinderStore} from "../../../common/bundles/entity-finder/entity-finder-data";
import {SiteTreeNode} from "../../../common/bundles/site-tree/site-tree-data";
import {ServerDataError} from "../../app/server-data-error";
import {RenderingCache} from "../../orm/server-cache";
import {EntityFinderError} from "../entity-finder/entity-finder-error";
import {asyncBuildNode} from "./async-build-site-node";

export class SiteTreeError extends ServerDataError {
    private id: string;
    private open: number[];
    private treeCache: { [id: string]: SiteTreeNode[] };
    private entityFinder: EntityFinderStore;
    private entityFinderError: null | EntityFinderError;

    public constructor(id: string,
                       open: number[],
                       treeCache: { [id: string]: SiteTreeNode[] },
                       entityFinder: EntityFinderStore,
                       entityFinderError: null | EntityFinderError) {
        super();
        this.id = id;
        this.open = open;
        this.treeCache = treeCache;
        this.entityFinder = entityFinder;
        this.entityFinderError = entityFinderError;
    }

    public loadData(cache: RenderingCache): Promise<Error | null> {
        return this.clearEntityError(cache)
            .then(() => this.entityFinder.find("sites", {_type: "site"}))
            .then(({data}) => {
                return Promise.map(data, entity => asyncBuildNode(cache, this.open, null, entity));
            })
            .then(nodes => {
                this.treeCache[this.id] = nodes;
                return null;
            });
    }

    private clearEntityError(cache: RenderingCache): Promise<Error | null> {
        return this.entityFinderError ? this.entityFinderError.loadData(cache) : Promise.resolve(null);
    }
}
