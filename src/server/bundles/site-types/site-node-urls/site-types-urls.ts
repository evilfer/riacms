import * as Promise from "bluebird";
import * as extend from "extend";
import {flattenArrays} from "../../../../common/utils/flatten-arrays";
import {CacheEntity, RenderingCache} from "../../../orm/server-cache";
import {ResolvedPageData} from "../../../../common/bundles/page-resolver/resolved-page-data";

export type SiteNodeUrlSegment = string | { ssl: boolean, host: string };

export interface SiteNodePartData {
    id: number;
    segments: SiteNodeUrlSegment[];
    next: null | SiteNodePartData;
}

export type SiteNodeUrlsData = SiteNodePartData[];

function loadParents(cache: RenderingCache, entity: CacheEntity): Promise<CacheEntity[]> {
    return cache.loadEntities((entity.content.parentLinks || []) as number[])
        .then(links => cache.loadEntities(links.map(link => link.content.parent as number)));
}

function node2UrlData(entity: CacheEntity,
                      next: null | SiteNodePartData = null): { isHost: boolean, data: SiteNodePartData } {
    const isHost = !!entity.content.host;
    let segments: SiteNodeUrlSegment[];
    if (isHost) {
        const ports = (entity.content.port || []) as number[];
        const usePorts = ports.filter(v => v !== 0);
        if (ports.indexOf(0) >= 0) {
            [80, 443].forEach(p => {
                if (usePorts.indexOf(p) < 0) {
                    usePorts.push(p);
                }
            });
        }

        segments = usePorts.map(p => {
            const ssl = p === 443;
            const portString = p !== 80 && p !== 443 ? `:${p}` : "";
            return {
                host: `${entity.content.host}${portString}`,
                ssl,
            };
        });
    } else {
        segments = (entity.content.paths as string[]).filter(v => !!v) || [];
    }
    return {
        data: {
            id: entity.entity.id,
            next,
            segments,
        },
        isHost,
    };
}

function compile(cache: RenderingCache,
                 entity: CacheEntity,
                 next: null | SiteNodePartData = null): Promise<SiteNodeUrlsData> {
    const {isHost, data} = node2UrlData(entity, next);
    if (isHost) {
        return Promise.resolve([data]);
    }

    return loadParents(cache, entity)
        .then(parents => Promise.all(parents.map(parent => {
            const partDataForParent = (next === null && !isHost && entity.content.homeOf === parent.entity.id)
                ? extend({}, data, {segments: [...data.segments, ""]}) : data;
            return compile(cache, parent, partDataForParent);
        })))
        .then(flattenArrays);
}

export function siteNodeUrls(cache: RenderingCache, id: number): Promise<SiteNodeUrlsData> {
    return cache.loadEntity(id)
        .then(entity => compile(cache, entity));
}

