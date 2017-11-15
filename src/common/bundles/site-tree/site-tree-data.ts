export interface SiteTreeNode {
    entity: any;
    link: null | any;
    children: null | SiteTreeNode[];
}

export interface SiteTreeData {
    loading: boolean;
    data: SiteTreeNode[];
}

export type SiteTreeLoadFunction = (open: number[]) => SiteTreeData;

export interface SiteTreeStore {
    getTree: SiteTreeLoadFunction;
}
