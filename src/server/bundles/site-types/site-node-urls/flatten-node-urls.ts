import {flattenArrays} from "../../../../common/utils/flatten-arrays";
import {SiteNodePartData, SiteNodeUrlsData, SiteNodeUrlSegment} from "./site-types-urls";

export type SiteNodeFlatUrlPart = [number, SiteNodeUrlSegment];

export type SiteNodeFlatUrl = SiteNodeFlatUrlPart[];

function flattenSegment(partData: SiteNodePartData): SiteNodeFlatUrl[] {
    const segments: SiteNodeFlatUrlPart[] = partData.segments.map(segment => (
        [partData.id as number, segment] as SiteNodeFlatUrlPart
    ));

    if (partData.next !== null) {
        return flattenArrays(segments.map(segment => {
            const next = flattenSegment(partData.next!);
            return next.map(nextUrl => [segment, ...nextUrl]);
        }));
    } else {
        return segments.map(segment => [segment]);
    }
}

export function flattenNodeUrls(data: SiteNodeUrlsData): SiteNodeFlatUrl[] {
    return flattenArrays(data.map(flattenSegment));
}
