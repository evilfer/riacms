import {ExchangeStoreData} from "../../app/exchange-data";

export interface ResolvedPageExchangeData extends ExchangeStoreData {
    found: boolean;
    site: number;
    page: number;
    path: string;
    route: number[];
}
