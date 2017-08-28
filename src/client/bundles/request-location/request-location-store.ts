import {action, observable, runInAction} from "mobx";
import {LocationStore} from "../../../common/bundles/location/location-data";
import {ClientHistory, ClientLocation} from "./client-history";

export class ClientRequestLocationStore implements LocationStore {

    @observable public protocol: string = "";
    @observable public hostname: string = "";
    @observable public path: string = "";
    @observable public port: number = 0;
    @observable public query: Map<string, string> = new Map();

    private history: ClientHistory;

    public constructor(history: ClientHistory) {
        this.history = history;

        history.onChange((location: ClientLocation) => {
            runInAction(() => {
                this.updateUrlData(location);
            });
        });

        this.updateUrlData(history.current());
    }

    @action
    public goto(path: string) {
        this.history.goto(path);
    }

    @action
    public updateUrlData(location: ClientLocation): void {
        this.protocol = location.protocol;
        this.hostname = location.hostname;
        this.path = location.pathname;
        this.port = parseInt(location.port, 10);

        const query: { [key: string]: string } = location.search
            .replace(/^\?/, "")
            .split("&")
            .filter(p => p.length > 0)
            .reduce((acc, part) => {
                const items = part.split("=");
                acc[decodeURIComponent(items[0])] = decodeURIComponent(items[1]);
                return acc;
            }, {} as { [key: string]: string });

        this.query.forEach((value, key) => {
            if (!query.hasOwnProperty(key)) {
                this.query.delete(key);
            } else if (value !== query[key]) {
                this.query.set(key, query[key]);
            }
        });

        Object.keys(query).forEach(key => {
            if (!this.query.has(key)) {
                this.query.set(key, query[key]);
            }
        });
    }
}
