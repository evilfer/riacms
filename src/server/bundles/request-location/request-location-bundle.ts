import * as Promise from "bluebird";
import {LocationData} from "../../../common/bundles/location/location-data";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";

export interface RequestLocationBundleStores extends ServerBundleDataInitMap {
    location: (context: ServerRequestContext) => Promise<LocationData>;
}

function parseQueryString(query: string): { [key: string]: string } {
    return query.split("&")
        .reduce((acc, part) => {
            const [key, value] = part.split("=");
            if (key && value) {
                acc[decodeURIComponent(key)] = decodeURIComponent(value);
            }
            return acc;
        }, {} as  { [key: string]: string });
}

export class RequestLocationBundle extends ServerBundle {
    public getName(): string {
        return "location";
    }

    public declareRequestDataServices(): RequestLocationBundleStores {
        return {
            location: (context: ServerRequestContext) => {
                const location: LocationData = {
                    hostname: "",
                    path: "",
                    port: 0,
                    protocol: "",
                    query: {},
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
            location: context => context.dataService("location"),
        };
    }
}
