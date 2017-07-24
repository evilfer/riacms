import {ClientBundle} from "../client-bundle";

export class ClientRenderingContextBundle extends ClientBundle {
    public getName(): string {
        return "clientRenderingContext";
    }

    public declareRenderingStores(): null | { [name: string]: () => any } {
        return {
            renderingContext: () => ({context: "client"}),
        };
    }
}
