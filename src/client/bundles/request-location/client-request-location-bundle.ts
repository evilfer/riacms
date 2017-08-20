import {ClientBundle} from "../client-bundle";
import {ClientHistory} from "./client-history";
import {RequestLocationStore} from "./request-location-store";

export class ClientRequestLocationBundle extends ClientBundle {
    private history: ClientHistory;

    public constructor(history: ClientHistory) {
        super();
        this.history = history;
    }

    public getName(): string {
        return "requestLocation";
    }

    public createStores(): null | { [name: string]: any } {
        return {
            location: new RequestLocationStore(this.history),
        };
    }
}
