import {ClientBundle} from "../client-bundle";

export class ClientRenderingContextBundle extends ClientBundle {
    public getName(): string {
        return "clientRenderingContext";
    }

    public createStores(): null | { [name: string]: any } {
        return {
            renderingContext: {context: "client"},
        };
    }
}
