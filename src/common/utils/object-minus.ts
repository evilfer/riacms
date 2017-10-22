export function objectMinus(obj: { [name: string]: any }, ...keys: string[]): { [name: string]: any } {
    return Object.keys(obj)
        .filter(key => keys.indexOf(key) < 0)
        .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {} as { [name: string]: any });
}
