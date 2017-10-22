import * as extend from "extend";
import {LocationStore} from "./location-data";

export function queryPath(location: LocationStore,
                          params: { [key: string]: null | string },
                          resetAll: boolean): string {

    const query = extend({}, params);
    if (!resetAll) {
        location.query.forEach((value, key) => {
            if (!query.hasOwnProperty(key)) {
                query[key] = location.query.get(key)!;
            }
        });
    }

    const queryItems = Object.keys(query)
        .filter(key => query[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key]!)}`);

    return location.path + (queryItems.length > 0 ? "?" + queryItems.join("&") : "");
}

export function gotoQuery(location: LocationStore, params: { [key: string]: null | string }, resetAll: boolean): void {
    location.goto(queryPath(location, params, resetAll));
}
