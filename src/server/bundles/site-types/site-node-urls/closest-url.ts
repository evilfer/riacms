import * as Promise from "bluebird";
import {ResolvedPageData} from "../../../../common/bundles/page-resolver/resolved-page-data";
import {RenderingCache} from "../../../orm/server-cache";
import {flattenNodeUrls, SiteNodeFlatUrl} from "./flatten-node-urls";
import {siteNodeUrls, SiteNodeUrlsData} from "./site-types-urls";

type FilterFunction = (urls: SiteNodeFlatUrl[]) => { depth: number, items: SiteNodeFlatUrl[] };

function siteFilterGen(resolvedPage: ResolvedPageData): FilterFunction {
    return (urls: SiteNodeFlatUrl[]) => ({
        depth: 0,
        items: urls.filter(([siteSegment]) => {
            return siteSegment &&
                siteSegment[0] === resolvedPage.site.entity.id &&
                (siteSegment[1] as { ssl: boolean }).ssl === resolvedPage.ssl;
        }),
    });
}

function pageFilterGen(resolvedPage: ResolvedPageData, pathIndex: number): FilterFunction {
    return (urls: SiteNodeFlatUrl[]) => {
        const depth = pathIndex + 1;
        const id = resolvedPage.route[depth].entity.id;
        const pathSegment = resolvedPage.pathSegments[pathIndex];

        return {
            depth,
            items: urls.filter(url => {
                return url.length > depth &&
                    url[depth][0] === id &&
                    url[depth][1] === pathSegment;
            }),
        };
    };
}

function* filterGen(resolvedPage: ResolvedPageData): IterableIterator<FilterFunction> {
    if (resolvedPage.site.entity.id) {
        yield siteFilterGen(resolvedPage);
        for (let i = 0; i < resolvedPage.route.length; i++) {
            yield pageFilterGen(resolvedPage, i);
        }
    }
}

export function closestFlatUrl(resolvedPage: ResolvedPageData, urls: SiteNodeFlatUrl[]): SiteNodeFlatUrl | null {
    if (urls.length === 0) {
        return null;
    }

    let filteredUrls = urls;

    for (const filter of filterGen(resolvedPage)) {
        if (filter !== null) {
            const {depth, items} = filter(filteredUrls);
            if (items === null || items.length === 0) {
                break;
            }
            filteredUrls = items;
            const depthItems = filteredUrls.filter(item => item.length === depth);
            if (depthItems.length > 0) {
                filteredUrls = depthItems;
                break;
            }
        }
    }

    const minLength = Math.max(2, Math.min.apply(null, filteredUrls.map(url => url.length)));
    return filteredUrls
            .filter(url => url.length === minLength)
            .sort((a, b) => (a[minLength - 1][1] as string).length - (b[minLength - 1][1] as string).length)
            [0]
        || null;
}

export function closestUrlById(cache: RenderingCache,
                               resolvedPage: ResolvedPageData,
                               id: number): Promise<SiteNodeFlatUrl | null> {
    return siteNodeUrls(cache, id)
        .then((data: SiteNodeUrlsData) => closestFlatUrl(resolvedPage, flattenNodeUrls(data)));
}
