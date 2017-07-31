import {CmsRequest} from "../bundle";

export function requestLevel(req: CmsRequest): number {
    return req.url.match(/\/_staging($|\?)/) ? 1 : 0;
}
