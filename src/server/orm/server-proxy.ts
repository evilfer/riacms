import {EntityContent} from "../../common/cache/entity-content";
import {TypeField} from "../../common/types/types";
import {Entity} from "../entity/entity";
import {ServerComputedEntityMetadata, ServerComputedFieldFunc} from "../entity/server-types";
import {CacheMissingComputedField} from "./cache-missing-computed-field";
import {RenderingCache} from "./server-cache";

export function createEntityProxy(cache: RenderingCache, content: EntityContent, used: any, rootEntity: Entity): any {
    const proxy: any = {};

    prepareRootEntityProps(cache, rootEntity, content, proxy, used);
    createDataProxy(cache, cache.getFields(rootEntity.type), rootEntity, content, proxy, used);

    return proxy;
}

function prepareRootEntityProps(cache: RenderingCache,
                                rootEntity: Entity,
                                content: EntityContent,
                                proxy: any,
                                used: any) {
    proxy._id = proxy.__id = rootEntity.id;
    proxy._type = proxy.__type = used._type = rootEntity.type;
    proxy.__content = content;
    proxy.__data = rootEntity.data;
    createLiteralGetter(cache, proxy, used, {name: "_data"}, rootEntity, {_data: rootEntity.data});
}

function createDataProxy(cache: RenderingCache,
                         fields: TypeField[],
                         metadata: ServerComputedEntityMetadata,
                         content: EntityContent,
                         proxy: any,
                         used: any) {
    fields.forEach(field => {
        switch (field.type) {
            case "string":
            case "string[]":
            case "number":
            case "number[]":
            case "boolean":
            case "boolean[]":
                createLiteralGetter(cache, proxy, used, field, metadata, content);
                break;
            case "related":
            case "related[]":
                createRelatedGetter(cache, proxy, used, field.name, content[field.name]);
                break;
            case "object":
                createNestedGetter(cache, field.nestedType, proxy, used, field, metadata, content);
                break;
            case "object[]":
                createMultipleNestedGetter(cache, field.nestedType, proxy, used, field, metadata, content);
                break;
        }
    });
}

function createLiteralGetter(cache: RenderingCache,
                             proxy: any,
                             used: any,
                             field: { name: string, impl?: ServerComputedFieldFunc },
                             metadata: ServerComputedEntityMetadata,
                             content: EntityContent) {
    if (field.impl) {
        let calculated = false;
        let value: any = null;
        Object.defineProperty(proxy, field.name, {
            get: () => {
                if (!calculated) {
                    calculated = true;
                    const result = cache.invokeComputedValue(content, metadata, field.impl!) as any;
                    if (result && typeof result.then === "function") {
                        throw new CacheMissingComputedField(metadata.type, field.name, result.then((v: any) => {
                            used[field.name] = value = v;
                        }));
                    } else {
                        used[field.name] = value = result;
                    }
                }

                return value;
            },
        });
    } else {
        const value = content[field.name];
        Object.defineProperty(proxy, field.name, {
            get: () => {
                used[field.name] = value;
                return value;
            },
        });
    }
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
                            nestedType: string,
                            proxy: any,
                            used: any,
                            field: TypeField,
                            metadata: ServerComputedEntityMetadata,
                            content: EntityContent) {

    const key = field.name;
    const value = content[key] as EntityContent;

    if (value) {
        const fields = cache.getFields(nestedType);

        let initialized: boolean = false;
        let nestedProxy: any;

        Object.defineProperty(proxy, key, {
            get: () => {
                if (!initialized) {
                    initialized = true;
                    nestedProxy = {};
                    const nestedUsed = {};
                    createDataProxy(cache, fields, {id: null, type: nestedType}, value, nestedProxy, nestedUsed);
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
                                    nestedType: string,
                                    proxy: any,
                                    used: any,
                                    field: TypeField,
                                    metadata: ServerComputedEntityMetadata,
                                    content: EntityContent) {

    const key = field.name;
    const value = content[key] as EntityContent[];

    const fields = cache.getFields(nestedType);

    let initialized: boolean = false;
    let nestedProxies: any[];

    Object.defineProperty(proxy, key, {
        get: () => {
            if (!initialized) {
                initialized = true;
                nestedProxies = [];
                const nestedUsedList: any[] = [];

                (value || []).forEach((item: any) => {
                    const nestedProxy = {};
                    const nestedUsed = {};
                    createDataProxy(cache, fields, {id: null, type: nestedType}, item, nestedProxy, nestedUsed);
                    nestedProxies.push(nestedProxy);
                    nestedUsedList.push(nestedUsed);
                });

                used[key] = nestedUsedList;
            }

            return nestedProxies;
        },
    });
}
