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
    wrapStoredOrComputed(cache, proxy, used, {name: "_data"},
        rootEntity, {_data: rootEntity.data},
        prepareLiteralValue);
}

function createNestedDataProxy(cache: RenderingCache,
                               fields: TypeField[],
                               metadata: ServerComputedEntityMetadata,
                               content: EntityContent,
                               proxy: any,
                               used: any) {

    proxy._type = used._type = metadata.type;
    createDataProxy(cache, fields, metadata, content, proxy, used);
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
            case "number":
            case "boolean":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, prepareLiteralValue);
                break;
            case "string[]":
            case "number[]":
            case "boolean[]":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, prepareLiteralMultipleValue);
                break;
            case "related":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, prepareRelatedValue);
                break;
            case "related[]":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, prepareRelatedMultipleValue);
                break;
            case "object":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, preparedNestedValue);
                break;
            case "object[]":
                wrapStoredOrComputed(cache, proxy, used, field, metadata, content, preparedMultipleNestedValue);
                break;
        }
    });
}

function prepareLiteralValue(cache: RenderingCache, value: undefined | null | any[]) {
    return {
        used: typeof value === "undefined" ? null : value,
        value,
    };
}

function prepareLiteralMultipleValue(cache: RenderingCache, value: null | undefined | any[]) {
    return {
        used: value || [],
        value,
    };
}

function prepareRelatedValue(cache: RenderingCache, value: undefined | null | number) {

    let output: any;
    if (!value) {
        output = null;
    } else if (typeof value === "number") {
        output = cache.getProxy(value);
    } else {
        output = null;
    }

    return {
        used: typeof value === "undefined" ? null : value,
        value: output,
    };
}

function prepareRelatedMultipleValue(cache: RenderingCache, value: null | number[]) {
    let output: any;

    if (value && value.length > 0) {
        output = cache.getProxies(value);
    } else {
        output = [];
    }

    return {
        used: value || [],
        value: output,
    };
}

function preparedNestedValue(cache: RenderingCache, value: undefined | null | EntityContent) {
    if (!value) {
        return {
            used: null,
            value: null,
        };
    }
    const nestedType = value._type as string;
    const fields = cache.getFields(nestedType);
    const nestedProxy = {};
    const nestedUsed = {};
    createNestedDataProxy(cache, fields, {id: null, type: nestedType}, value, nestedProxy, nestedUsed);

    return {
        used: nestedUsed,
        value: nestedProxy,
    };
}

function preparedMultipleNestedValue(cache: RenderingCache, value: null | EntityContent[]) {

    if (!value || value.length === 0) {
        return {
            customUsedData: true,
            used: [],
            value: [],
        };
    }

    const nestedProxies: any[] = [];
    const nestedUsedList: any[] = [];

    (value || []).forEach((item: any) => {
        const nestedType = item._type as string;
        const fields = cache.getFields(nestedType);

        const nestedProxy = {};
        const nestedUsed = {};
        createNestedDataProxy(cache, fields, {id: null, type: nestedType}, item, nestedProxy, nestedUsed);
        nestedProxies.push(nestedProxy);
        nestedUsedList.push(nestedUsed);
    });

    return {
        used: nestedUsedList,
        value: nestedProxies,
    };
}

type PrepareValueFunc = (cache: RenderingCache,
                         value: any) => { value: any, used: any };

function wrapStoredOrComputed(cache: RenderingCache,
                              proxy: any,
                              used: any,
                              field: { name: string, impl?: ServerComputedFieldFunc },
                              metadata: ServerComputedEntityMetadata,
                              content: EntityContent,
                              func: PrepareValueFunc): void {

    let initialize = true;
    let value: any;
    const setValue = (v: any) => {
        const prepared = func(cache, v);
        initialize = false;
        value = prepared.value;
        used[field.name] = prepared.used;
    };

    if (!field.impl) {

        Object.defineProperty(proxy, field.name, {
            get: () => {
                if (initialize) {
                    setValue(content[field.name]);
                }
                return value;
            },
        });
    } else {
        Object.defineProperty(proxy, field.name, {
            get: () => {
                if (initialize) {
                    const result = cache.invokeComputedValue(content, metadata, field.impl!) as any;
                    if (result && typeof result.then === "function") {
                        throw new CacheMissingComputedField(metadata.type, field.name, result.then((v: any) => {
                            setValue(v);
                        }));
                    } else {
                        setValue(result);
                    }
                }

                return value;
            },
        });
    }
}
