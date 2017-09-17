import * as Promise from "bluebird";
import * as clone from "clone";
import {EntityContent} from "../../../common/cache/entity-content";
import {TypeManager} from "../../../common/types/type-manager";
import {RelatedTypeField} from "../../../common/types/types";
import {Entity} from "../../entity/entity";
import {EntityDbWriteTransaction} from "../entity-db";

function diff<T>(oldList: T[], newList: T[]): { added: T[], removed: T[] } {
    return {
        added: newList.filter(v => oldList.indexOf(v) < 0),
        removed: oldList.filter(v => newList.indexOf(v) < 0),
    };
}

type ChangeList = Array<{ name: string, add: boolean, level: number }>;

function updatePromise(types: TypeManager,
                       transaction: EntityDbWriteTransaction,
                       sourceId: number,
                       targetId: number,
                       changes: ChangeList): Promise<Entity> {

    return transaction.load(targetId)
        .then(target => {
            const oldData = target.data;
            const newData = clone(oldData);
            changes.forEach(({name, add, level}) => {
                while (newData.length <= level) {
                    newData.push({});
                }

                const levelData = newData[level];

                const fieldType = types.getFieldType(target.type, name);
                if (fieldType === "related") {
                    if (add) {
                        levelData[name] = sourceId;
                    } else if (levelData[name] === sourceId) {
                        levelData[name] = null;
                    }
                } else if (fieldType === "related[]") {
                    if (!levelData[name]) {
                        levelData[name] = [];
                    }

                    const array = levelData[name] as number[];
                    const index = array.indexOf(sourceId);

                    if (add && index < 0) {
                        array.push(sourceId);
                    } else if (!add && index >= 0) {
                        array.splice(index, 1);
                    }
                }
            });
            return transaction.updateEntity(targetId, newData);
        });
}

export function updateRelated(types: TypeManager,
                              trx: EntityDbWriteTransaction,
                              entity: Entity,
                              oldData: EntityContent[],
                              newData: EntityContent[]): Promise<Entity> {

    const levels = Math.max(newData.length, oldData.length);
    const changes: { [id: string]: ChangeList } = {};

    const fields = types.getFields(entity.type);
    fields.forEach(field => {
        const {name, type, inverseField} = field as RelatedTypeField;
        if (inverseField) {
            for (let i = 0; i < levels; i++) {
                let fieldChanges: null | { added: number[], removed: number[] } = null;

                if (type === "related[]") {
                    fieldChanges = diff(
                        (oldData[i] && oldData[i][name] || []) as number[],
                        (newData[i] && newData[i][name] || []) as number[],
                    );
                } else if (type === "related") {
                    fieldChanges = diff(
                        (oldData[i] && oldData[i][name] ? [oldData[i][name]] : []) as number[],
                        (newData[i] && newData[i][name] ? [newData[i][name]] : []) as number[],
                    );
                }

                if (fieldChanges !== null) {
                    fieldChanges.added.forEach(id => {
                        if (!changes[id]) {
                            changes[id] = [];
                        }
                        changes[id].push({add: true, level: i, name: inverseField});
                    });

                    fieldChanges.removed.forEach(id => {
                        if (!changes[id]) {
                            changes[id] = [];
                        }
                        changes[id].push({add: false, level: i, name: inverseField});
                    });
                }
            }
        }
    });

    const promises = Object.keys(changes)
        .filter(id => changes[id].length > 0)
        .map(id => updatePromise(types, trx, entity.id, parseInt(id, 10), changes[id]));

    return Promise.all(promises).then(() => entity);
}
