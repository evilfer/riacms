
export interface EntityFinderData {
    loading: boolean;
    data: any[];
}

export interface EntityByIdData {
    loading: boolean;
    entity: any;
}

export type EntityFinderFunction = (name: string,
                                    query: { [field: string]: boolean | string | number }) => EntityFinderData;

export type EntityByIdFunction = (id: number) => EntityByIdData;

export interface EntityFinderStore {
    byId: EntityByIdFunction;
    find: EntityFinderFunction;
}

export function queryHash(query: { [field: string]: number | boolean | string }): string {
    return JSON.stringify(query);
}
