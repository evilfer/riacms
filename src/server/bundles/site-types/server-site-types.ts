import * as Promise from "bluebird";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {EntityContent, EntityContentValue} from "../../../common/cache/entity-content";
import {ServerContext} from "../../app/server-context";
import {ServerComputedEntityMetadata, ServerTypeManagerBuilder} from "../../entity/server-types";
import {ServerRequestContext} from "../server-bundle";
import {closestUrlById} from "./site-node-urls/closest-url";
import {SiteNodeFlatUrl} from "./site-node-urls/flatten-node-urls";

function urlImpl(content: EntityContent,
                 metadata: ServerComputedEntityMetadata,
                 ctx: ServerContext,
                 req: ServerRequestContext): Promise<null | EntityContentValue> {

    return req.dataService("resolvedPage")
        .then((resolvedPage: ResolvedPageData) => closestUrlById(req.cache, resolvedPage, metadata.id!))
        .then((url: SiteNodeFlatUrl | null) => {
            if (url === null) {
                return null;
            }
            return {
                _type: "site_tree_parent_url",
                segments: url.map(([id, segment]) => {
                    const isPage = typeof segment === "string";

                    return {
                        _type: "site_tree_parent_url_segment",
                        node: id,
                        segment: isPage ? segment : (segment as { host: string }).host,
                        ssl: isPage ? false : (segment as { ssl: boolean }).ssl,
                    };
                }),
            };
        });
}

export function applyServerSiteTypes(typeBuilder: ServerTypeManagerBuilder): void {
    typeBuilder.implementComputed(
        "site_tree_parent",
        "hasChildren",
        (content: EntityContent) => content.childLinks && (content.childLinks as number[]).length > 0,
    );

    typeBuilder.implementComputed(
        "site_tree_parent",
        "url",
        urlImpl,
    );
}
