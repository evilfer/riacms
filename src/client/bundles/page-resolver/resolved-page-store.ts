import {action, computed, observable} from "mobx";
import formatPath from "../../../common/bundles/page-resolver/format-path";
import {ResolvedPageData} from "../../../common/bundles/page-resolver/resolved-page-data";
import {ResolvedPageExchangeData} from "../../../common/bundles/page-resolver/resolved-page-ex-data";
import {RenderEntity} from "../../../common/cache/entity-content";
import {ClientCache} from "../../cache/client-cache";
import {ClientRequestLocationStore} from "../request-location/request-location-store";
import {ClientPageResolverError} from "./client-page-resolver-error";

/**
 * Uses:
 * - Data from server:
 *   - found: boolean
 *   - site: number
 *   - page: number
 *   - route: number[]
 * request location for other params
 */

export class ClientResolvedPageStore implements ResolvedPageData {

    @computed
    public get loading(): boolean {
        return !this.data.has(this.path);
    }

    @computed
    public get path(): string {
        return formatPath(this.requestLocation.path);
    }

    @computed
    public get pathSegments(): string[] {
        return this.path.split("/");
    }

    @computed
    public get site(): null | RenderEntity {
        return this.bestData && this.entityOrNull(this.bestData.site);
    }

    @computed
    public get page(): null | RenderEntity {
        return this.bestData && this.entityOrNull(this.bestData.page);
    }

    @computed
    public get route(): RenderEntity[] {
        return this.bestData && this.bestData.route.map(id => this.entityOrNull(id)) || [];
    }

    @computed
    public get found(): boolean {
        return this.bestData && this.bestData.found || false;
    }

    @computed
    public get admin(): boolean {
        return !!this.requestLocation.path.match(/\/_admin($|\?|#)/);
    }

    @computed
    public get level(): number {
        return this.requestLocation.path.match(/\/_staging($|\?|#)/) ? 1 : 0;
    }

    @computed
    public get ssl(): boolean {
        return this.requestLocation.protocol === "https";
    }

    @computed
    private get bestData(): null | ResolvedPageExchangeData {
        return this.data.get(this.path) || this.data.get(this.lastKnownPath) || null;
    }

    @observable
    private data: Map<string, ResolvedPageExchangeData> = new Map();

    @observable
    private lastKnownPath: string;

    private cache: ClientCache;
    private requestLocation: ClientRequestLocationStore;

    public constructor(cache: ClientCache, requestLocation: ClientRequestLocationStore) {
        this.cache = cache;
        this.requestLocation = requestLocation;
    }

    @action
    public loadStoreData(data: ResolvedPageExchangeData): void {
        this.data.set(formatPath(data.path), data);
        if (data.path === this.path) {
            this.lastKnownPath = data.path;
        }
    }

    public getError(): null | ClientPageResolverError {
        return this.data.has(this.path) ? null : new ClientPageResolverError();
    }

    private entityOrNull(id: null | number): null | any {
        return id ? this.cache.getEntity(id) : null;
    }
}
