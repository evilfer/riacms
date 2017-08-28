
export interface ExchangeEntityData {
    _type: string;

    [field: string]: any;
}

export interface ExchangeEntityDataMap {
    [id: number]: ExchangeEntityData;
}

export interface ExchangeStoreData {
    [name: string]: any;
}

export interface ExchangeStoreDataMap {
    [name: string]: ExchangeStoreData;
}

export interface ExchangeData {
    e: ExchangeEntityDataMap;
    s: ExchangeStoreDataMap;
}
