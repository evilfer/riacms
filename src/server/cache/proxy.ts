import {TypeDefinition} from "../../common/types/types";
import {Entity, EntityContent} from "../entity/entity";
import {RenderingCache} from "./cache";

const ROOT_ENTITY_PROPS: Array<keyof Entity> = ["id", "type", "data"];

export function createEntityProxy(cache: RenderingCache, content: EntityContent, used: any, rootEntity: Entity): any {
    const proxy: any = {};

    if (rootEntity) {
        ROOT_ENTITY_PROPS.forEach(key => {
            const proxyKey = `_${key}`;
            createLiteralGetter(proxy, used, proxyKey, rootEntity[key]);
        });
    }

    createDataProxy(cache, cache.getFields(rootEntity.type), content, proxy, used);

    return proxy;
}

function createDataProxy(cache: RenderingCache, fields: TypeDefinition, content: EntityContent, proxy: any, used: any) {
    fields.forEach(field => {
        switch (field.type) {
            case "string":
            case "string[]":
            case "number":
            case "number[]":
            case "boolean":
            case "boolean[]":
                createLiteralGetter(proxy, used, field.name, content[field.name]);
                break;
            case "related":
            case "related[]":
                createRelatedGetter(cache, proxy, used, field.name, content[field.name]);
                break;
            case "object":
                createNestedGetter(cache, field.nestedFields, proxy, used, field.name, content[field.name]);
                break;
            case "object[]":
                createMultipleNestedGetter(cache, field.nestedFields, proxy, used, field.name, content[field.name]);
                break;
        }
    });
}

function createLiteralGetter(proxy: any, used: any, key: string, value: any) {
    Object.defineProperty(proxy, key, {
        get: () => {
            used[key] = value;
            return value;
        },
    });
}

function createRelatedGetter(cache: RenderingCache, proxy: any, used: any, key: string, value: any) {
    let related: any;

    Object.defineProperty(proxy, key, {
        get: () => {
            if (related !== undefined) {
                return related;
            }

            used[key] = value;

            if (value === null) {
                related = null;
                return null;
            }

            if (typeof value === "number") {
                return cache.getProxy(value);
            } else {
                return cache.getProxies(value);
            }
        },
    });
}

function createNestedGetter(cache: RenderingCache,
                            fields: TypeDefinition,
                            proxy: any,
                            used: any,
                            key: string,
                            value: any) {
    if (value) {
        let initialized: boolean = false;
        let nestedProxy: any;

        Object.defineProperty(proxy, key, {
            get: () => {
                if (!initialized) {
                    initialized = true;
                    nestedProxy = {};
                    const nestedUsed = {};
                    createDataProxy(cache, fields, value, nestedProxy, nestedUsed);
                    used[key] = nestedUsed;
                }
                return nestedProxy;
            },
        });
    } else {
        Object.defineProperty(proxy, key, {
            get: () => {
                used[key] = null;
                return null;
            },
        });
    }
}

function createMultipleNestedGetter(cache: RenderingCache,
                                    fields: TypeDefinition,
                                    proxy: any,
                                    used: any,
                                    key: string,
                                    value: any) {
    let initialized: boolean = false;
    let nestedProxies: any[];

    Object.defineProperty(proxy, key, {
        get: () => {
            if (!initialized) {
                initialized = true;
                nestedProxies = [];
                const nestedUsedList: any[] = [];

                (value || []).forEach((content: any) => {
                    const nestedProxy = {};
                    const nestedUsed = {};
                    createDataProxy(cache, fields, content, nestedProxy, nestedUsed);
                    nestedProxies.push(nestedProxy);
                    nestedUsedList.push(nestedUsed);
                });

                used[key] = nestedUsedList;
            }

            return nestedProxies;
        },
    });
}
