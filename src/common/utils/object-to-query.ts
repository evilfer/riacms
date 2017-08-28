export function obj2query(query: { [key: string]: string }): string {
    const items: string[] = [];
    Object.keys(query).forEach(key => items.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`));
    return items.length === 0 ? "" : "?" + items.join("&");
}

export function map2query(query: Map<string, string>): string {
    const items: string[] = [];
    query.forEach((value, key) => items.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`));
    return items.length === 0 ? "" : "?" + items.join("&");
}
