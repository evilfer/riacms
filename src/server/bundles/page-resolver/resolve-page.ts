import * as Promise from "bluebird";
import {LocationData} from "../../../common/bundles/location/location-data";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {CacheEntity, RenderingCache} from "../../orm/server-cache";
import {ServerRequestContext} from "../server-bundle";
import formatPath from "../../../common/bundles/page-resolver/format-path";

export function resolvePage(context: ServerRequestContext): Promise<ResolvedPageData> {
    return context.dataService("location")
        .then((location: LocationData) => {
            const match = location.path.match(/^([^?]*?)(?:\/_(staging|admin))?$/);

            if (!location.hostname || match === null) {
                return Promise.resolve({
                    admin: false,
                    found: false,
                    level: context.cache.getLevel(),
                    loading: false,
                    page: null,
                    path: location.path,
                    route: [],
                    site: null,
                    ssl: false,
                });
            }

            const trimmedPath = formatPath(match[1]);
            const path: null | string[] = trimmedPath.length > 0 ? trimmedPath.split("/") : null;

            const suffix: string = match[2];

            const store: ResolvedPageData = {
                admin: suffix === "admin",
                found: false,
                level: context.cache.getLevel(),
                loading: false,
                page: null,
                path: location.path,
                route: [],
                site: null,
                ssl: location.protocol === "https",
            };

            return findSite(context.cache, location.hostname, location.port)
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
        });
}

function findSite(cache: RenderingCache, hostName: string, port: number): Promise<null | CacheEntity> {
    return cache.find()
        .implementsType("site")
        .valueIn("site", "host", [hostName, "*"])
        //.arrayContainsAny("site", "port", [port, 0])
        .run()
        .then(entities => {
            entities
                .filter(({content}) => {
                    const ports: number[] = content.port as number[];
                    return ports.indexOf(0) >= 0 || ports.indexOf(port) >= 0;
                })
                .sort((a, b) => {
                    if (a.content.host !== "*" && b.content.host === "*") {
                        return -1;
                    } else if (a.content.host === "*" && b.content.host !== "*") {
                        return 1;
                    }

                    const matchPortA = (a.content.port as number[]).indexOf(port) >= 0;
                    const matchPortB = (a.content.port as number[]).indexOf(port) >= 0;

                    if (matchPortA && !matchPortB) {
                        return -1;
                    } else if (!matchPortA && matchPortB) {
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
        .implementsType("site_tree_link")
        .valueEquals("site_tree_link", "parent", parentId)
        .run()
        .then(links => cache.find()
            .implementsType("page")
            .idIn(links.map(link => link.content.child) as number[])
            .arrayContains("page", "paths", path[index])
            .run()
            .then(([item]) => {
                if (item) {
                    store.route.push(item);
                    return findPath(cache, store, path, index + 1, item.entity.id);
                }

                return false;
            }));
}
