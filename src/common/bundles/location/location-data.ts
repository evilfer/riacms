export interface LocationData {
    query: { [key: string]: string };
    protocol: string;
    port: number;
    hostname: string;
    path: string;
}
