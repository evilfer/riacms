const storeList: Array<[string, () => any]> = [];

export function registerWidgetStore(name: string, createStore: () => any) {
    storeList.push([name, createStore]);
}

export function initWidgetStores() {
    return storeList.reduce((acc, [name, f]) => {
        acc[name] = f();
        return acc;
    }, {} as { [name: string]: any });
}
