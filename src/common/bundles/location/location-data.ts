export interface LocationData {
    query: Map<string, string>;
    protocol: string;
    port: number;
    hostname: string;
    path: string;
}

export interface LocationStore extends LocationData {
    goto: (path: string) => void;
}
