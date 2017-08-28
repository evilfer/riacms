
import {ClientHistory, ClientLocation} from "../../../../src/client/bundles/request-location/client-history";

export class DummyHistory implements ClientHistory {
    private location: ClientLocation = {
        hash: "",
        hostname: "",
        pathname: "",
        port: "",
        protocol: "",
        search: "",
    };

    private callbacks: Array<(location: ClientLocation) => void> = [];

    public init(protocol: string,
                hostname: string,
                port: string,
                pathname: string,
                search: string) {
        this.location.protocol = protocol;
        this.location.hostname = hostname;
        this.location.port = port;
        this.location.pathname = pathname;
        this.location.search = search;
    }

    public current(): ClientLocation {
        return this.location;
    }

    public onChange(callback: (location: ClientLocation) => void): void {
        this.callbacks.push(callback);
    }

    public goto(path: string, search: string = ""): void {
        this.location.pathname = path;
        this.location.search = search;
        this.callbacks.forEach(cb => cb(this.location));
    }
}
