import * as he from "he";
import {ExchangeData} from "../../common/app/exchange-data";

const DEFAULT_DATA: ExchangeData = {
    e: {},
    s: {},
};

export function parseExchangeData(): ExchangeData {
    const script = document.getElementById("ria-data");
    if (!script) {
        return DEFAULT_DATA;
    }

    try {
        return JSON.parse(he.decode(script.innerText));
    } catch (e) {
        return DEFAULT_DATA;
    }
}
