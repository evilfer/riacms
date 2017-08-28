import {ClientHistory, ClientLocation} from "./client-history";

export class BrowserHistory implements ClientHistory {

    private listeners: Array<(location: ClientLocation) => void>;

    public constructor() {
        this.listeners = [];
        window.onpopstate = () => this.fireChange();
    }

    public current(): ClientLocation {
        return window.location;
    }

    public onChange(callback: (location: ClientLocation) => void): void {
        this.listeners.push(callback);
    }

    public goto(path: string): void {
        window.history.pushState({}, "", path);
        this.fireChange();
    }

    private fireChange() {
        this.listeners.forEach(listener => listener(window.location));
    }
}
