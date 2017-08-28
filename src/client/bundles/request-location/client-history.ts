export interface ClientLocation {
    hash: string;
    hostname: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
}

export interface ClientHistory {
    current: () => ClientLocation;
    onChange: (callback: (location: ClientLocation) => void) => void;
    goto: (path: string) => void;
}
