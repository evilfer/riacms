import * as Promise from "bluebird";
import {ServerBundle, ServerBundleDataInitMap} from "../server-bundle";

export class ServerRenderingContextBundle extends ServerBundle {
    public getName(): string {
        return "serverRenderingContext";
    }

    public declareRenderingStores(): ServerBundleDataInitMap {
        return {
            renderingContext: () => Promise.resolve({context: "server"}),
        };
    }
}
