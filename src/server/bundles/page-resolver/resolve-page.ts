import * as Promise from "bluebird";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {CacheEntity, RenderingCache} from "../../orm/cache";
import {ServerRequestContext} from "../server-bundle";

export function resolvePage(context: ServerRequestContext): Promise<ResolvedPageData> {

    const match = context.req.url.match(/http(s)?:\/\/([^/:]+)(?::([0-9]+))?([^?]*)/);

    if (!match) {
        return Promise.resolve({loading: false, site: null, page: null, route: [], found: false});
    }

    const isHttps = !!match[1];
    const hostName = match[2];
    const port = parseInt(match[3] || "80", 10);
    const trimmedPath = match[4].replace(/(^\/)|(\/$)/g, "");
    const path = trimmedPath && trimmedPath.split("/") || null;

    const store: ResolvedPageData = {
        found: false,
        loading: false,
        page: null,
        route: [],
        site: null,
    };

    return findSite(context.cache, hostName, port)
        .then(site => {
            if (site) {
                store.site = site;

                if (!path) {
                    if (site.content.home) {
                        return context.cache.loadEntity(site.content.home as number)
                            .then(page => {
                                store.page = page;
                                store.found = true;
                            });
                    } else if (site.content.notFound) {
                        return context.cache.loadEntity(site.content.notFound as number)
                            .then(page => {
                                store.page = page;
                            });
                    }
                } else {
                    return findPath(context.cache, store, path, 0, site.entity.id)
                        .then(found => {
                            store.found = found;
                            if (found) {
                                store.page = store.route[store.route.length - 1];
                            } else if (site.content.notFound) {
                                return context.cache.loadEntity(site.content.notFound as number)
                                    .then(page => {
                                        store.page = page;
                                    });
                            }
                        });
                }
            }
        })
        .then(() => store);

}

function findSite(cache: RenderingCache, hostName: string, port: number): Promise<null | CacheEntity> {
    return cache.find()
        .valueIn("host", [hostName, "*"])
        .valueIn("port", [port, null])
        .run()
        .then(entities => {
            entities
                .filter(({content}) => content.port === null || content.port === port)
                .sort((a, b) => {
                    if (a.content.host !== "*" && b.content.host === "*") {
                        return -1;
                    } else if (a.content.host === "*" && b.content.host !== "*") {
                        return 1;
                    } else if (a.content.port !== null && b.content.port === null) {
                        return -1;
                    } else if (a.content.port === null && b.content.port !== null) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

            return entities[0] ? entities[0] : null;
        });
}

function findPath(cache: RenderingCache,
                  store: ResolvedPageData,
                  path: string[],
                  index: number,
                  parentId: number): Promise<boolean> {

    if (index >= path.length) {
        return Promise.resolve(true);
    }

    return cache.find()
        .arrayContains("parents", parentId)
        .arrayContains("paths", path[index])
        .run()
        .then(([item]) => {
            if (item) {
                store.route.push(item);
                return findPath(cache, store, path, index + 1, item.entity.id);
            }

            return false;
        });
}
