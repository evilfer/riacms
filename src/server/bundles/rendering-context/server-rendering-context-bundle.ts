import {ServerBundle} from "../server-bundle";

export class ServerRenderingContextBundle extends ServerBundle {
    public getName(): string {
        return "serverRenderingContext";
    }

    public declareRenderingStores(): null | { [name: string]: () => any } {
        return {
            renderingContext: () => ({context: "server"}),
        };
    }
}
