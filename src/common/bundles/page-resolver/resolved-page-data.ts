export interface ResolvedPageData {
    path: string;
    pathSegments: string[];
    site: null | any;
    page: null | any;
    route: any[];
    found: boolean;
    loading: boolean;
    admin: boolean;
    level: number;
    ssl: boolean;
}
