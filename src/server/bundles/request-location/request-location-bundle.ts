import * as Promise from "bluebird";
import * as extend from "extend";
import {LocationData, LocationStore} from "../../../common/bundles/location/location-data";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";

export interface RequestLocationBundleServices extends ServerBundleDataInitMap {
    location: (context: ServerRequestContext) => Promise<LocationData>;
}

export interface RequestLocationBundleStores extends ServerBundleDataInitMap {
    location: (context: ServerRequestContext) => Promise<LocationStore>;
}

function parseQueryString(query: string): Map<string, string> {
    return query.split("&")
        .reduce((acc, part) => {
            const [key, value] = part.split("=");
            if (key && value) {
                acc.set(decodeURIComponent(key), decodeURIComponent(value));
            }
            return acc;
        }, new Map<string, string>());
}

export class RequestLocationBundle extends ServerBundle {
    public getName(): string {
        return "location";
    }

    public declareRequestDataServices(): RequestLocationBundleServices {
        return {
            location: (context: ServerRequestContext) => {
                const location: LocationData = {
                    hostname: "",
                    path: "",
                    port: 0,
                    protocol: "",
                    query: new Map(),
                };

                const match = context.req.url.match(/(https?):\/\/([^/:]+)(?::([0-9]+))?([^?]*)(?:\?(.*))?$/);

                if (match) {
                    location.protocol = match[1];
                    location.hostname = match[2];
                    location.path = match[4];
                    location.port = match[3] ? parseInt(match[3], 10) : 80;
                    location.query = parseQueryString(match[5] || "");
                }

                return Promise.resolve(location);
            },
        };
    }

    public declareRenderingStores(): RequestLocationBundleStores {
        return {
            location: context => context.dataService("location")
                .then((location: LocationData) => extend({
                    goto: () => {
                        return;
                    },
                }, location)),
        };
    }
}
