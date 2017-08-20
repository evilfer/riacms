import * as he from "he";

export interface ClientAssetData {
    [id: number]: { [field: string]: any };
}

export interface ClientStoreData {
    [name: string]: any;
}

export interface ClientData {
    a: ClientAssetData;
    s: ClientStoreData;
}

const DEFAULT_DATA = {
    a: {},
    s: {},
};

export function parseInitialData(): ClientData {
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
