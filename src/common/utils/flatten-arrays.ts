export function flattenArrays<T>(arrays: T[][]): T[] {
    return arrays.reduce((acc, array) => acc.concat(array), []);
}
