export interface EntityFinderData {
    loading: boolean;
    data: any[];
}

export type EntityFinderFunction = (name: string,
                                    query: { [field: string]: boolean | string | number }) => EntityFinderData;

export interface EntityFinderStore {
    find: EntityFinderFunction;
}

export function queryHash(query: { [field: string]: number | boolean | string }): string {
    return JSON.stringify(query);
}
