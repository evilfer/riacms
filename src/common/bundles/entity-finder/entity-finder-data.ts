export type EntityFinderFunction = (name: string, query: { [field: string]: boolean | string | number }) => {
    loading: boolean,
    data: any[],
};

export interface EntityFinderStore {
    find: EntityFinderFunction;
}
