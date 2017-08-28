import {EntityContent, EntityContentValue, RenderEntity} from "../../common/cache/entity-content";
import {TypeField} from "../../common/types/types";
import {ClientCache} from "./client-cache";

export function createEntityProxy(cache: ClientCache, id: number, entityData: EntityContent): any {
    const proxy: RenderEntity = prepareRootEntityProps(cache, id, entityData);
    createDataProxy(cache, cache.getFields(entityData._type as string), id, entityData, proxy, "");

    return proxy;
}

function prepareRootEntityProps(cache: ClientCache, id: number, entityData: EntityContent): RenderEntity {
    const proxy: RenderEntity = {
        _id: id,
        _type: entityData._type as string,
    };

    createLiteralGetter(cache, id, entityData, proxy, "_data", "");
    return proxy;
}

function createDataProxy(cache: ClientCache,
                         fields: TypeField[],
                         id: number,
                         entityData: EntityContent,
                         proxy: EntityContent,
                         keyBase: string) {
    fields.forEach(field => {
        switch (field.type) {
            case "string":
            case "string[]":
            case "number":
            case "number[]":
            case "boolean":
            case "boolean[]":
                createLiteralGetter(cache, id, entityData, proxy, field.name, keyBase);
                break;
            case "related":
                createRelatedGetter(cache, id, entityData, proxy, field.name, keyBase);
                break;
            case "related[]":
                createMultipleRelatedGetter(cache, id, entityData, proxy, field.name, keyBase);
                break;
            case "object":
                createNestedGetter(cache, id, entityData, proxy, field.name, keyBase, field.nestedFields);
                break;
            case "object[]":
                createMultipleNestedGetter(cache, id, entityData, proxy, field.name, keyBase, field.nestedFields);
                break;
        }
    });
}

function shouldCreateDataGetter(cache: ClientCache,
                                id: number,
                                entityData: EntityContent,
                                proxy: EntityContent,
                                key: string,
                                keyBase: string,
                                defaultValue: EntityContentValue = null): boolean {
    if (entityData.hasOwnProperty(key)) {
        return true;
    }

    Object.defineProperty(proxy, key, {
        get: () => {
            cache.declareMissingData(id, keyBase + key);
            return defaultValue;
        },
    });

    return false;
}

function createLiteralGetter(cache: ClientCache,
                             id: number,
                             entityData: EntityContent,
                             proxy: EntityContent,
                             key: string,
                             keyBase: string) {

    if (shouldCreateDataGetter(cache, id, entityData, proxy, key, keyBase)) {
        const value = entityData[key];
        Object.defineProperty(proxy, key, {
            get: () => value,
        });
    }
}

function createRelatedGetter(cache: ClientCache,
                             id: number,
                             entityData: EntityContent,
                             proxy: EntityContent,
                             key: string,
                             keyBase: string) {

    if (shouldCreateDataGetter(cache, id, entityData, proxy, key, keyBase)) {
        let related: null | RenderEntity;

        Object.defineProperty(proxy, key, {
            get: () => {
                if (related === undefined) {
                    related = cache.getEntity(entityData[key] as number);
                }
                return related;
            },
        });
    }
}

function createMultipleRelatedGetter(cache: ClientCache,
                                     id: number,
                                     entityData: EntityContent,
                                     proxy: EntityContent,
                                     key: string,
                                     keyBase: string) {

    if (shouldCreateDataGetter(cache, id, entityData, proxy, key, keyBase, [])) {
        let related: RenderEntity[];

        Object.defineProperty(proxy, key, {
            get: () => {
                if (related === undefined) {
                    related = cache.getEntities(entityData[key] as number[]);
                }
                return related;
            },
        });
    }
}

function createNestedGetter(cache: ClientCache,
                            id: number,
                            entityData: EntityContent,
                            proxy: EntityContent,
                            key: string,
                            keyBase: string,
                            fields: TypeField[]) {

    if (shouldCreateDataGetter(cache, id, entityData, proxy, key, keyBase)) {
        const dataValue = entityData[key] as null | EntityContent;
        let proxyValue: null | EntityContent;

        if (dataValue === null) {
            proxyValue = null;
        } else {
            proxyValue = {};
            createDataProxy(cache, fields, id, dataValue, proxyValue, `${keyBase}${key}.`);
        }
        Object.defineProperty(proxy, key, {
            get: () => proxyValue,
        });
    }
}

function createMultipleNestedGetter(cache: ClientCache,
                                    id: number,
                                    entityData: EntityContent,
                                    proxy: EntityContent,
                                    key: string,
                                    keyBase: string,
                                    fields: TypeField[]) {

    if (shouldCreateDataGetter(cache, id, entityData, proxy, key, keyBase, [])) {
        const dataValue = entityData[key] as EntityContent[];
        const proxyValue: EntityContent[] = dataValue.map((v, i) => {
            const nestedProxy = {};
            createDataProxy(cache, fields, id, v, nestedProxy, `${keyBase}${key}.${i}.`);
            return nestedProxy;
        });

        Object.defineProperty(proxy, key, {
            get: () => proxyValue,
        });
    }
}
