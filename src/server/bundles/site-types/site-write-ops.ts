import * as Promise from "bluebird";
import {EntityContent} from "../../../common/cache/entity-content";
import {TypeManager} from "../../../common/types/type-manager";
import {Entity} from "../../entity/entity";
import {CachedTransaction} from "../../orm/cached-transaction/cached-transaction";
import {EntityDb} from "../../orm/entity-db";

export function createSite(types: TypeManager,
                           db: EntityDb,
                           uid: number,
                           data: EntityContent[],
                           type: string = "site"): Promise<Entity> {
    return CachedTransaction.open(types, db, "create", uid)
        .then(transaction => transaction.createEntity(type, data)
            .then(entity => transaction.commit()
                .then(() => entity)));
}

export function createPage(types: TypeManager,
                           db: EntityDb,
                           uid: number,
                           parentId: number,
                           data: EntityContent[],
                           type: string = "page"): Promise<Entity> {
    return CachedTransaction.open(types, db, "create", uid)
        .then(transaction => transaction.createEntity(type, data)
            .then(page => transaction.createEntity("site_tree_link", [{
                child: page.id,
                parent: parentId,
            }])
                .then(() => transaction.commit())
                .then(() => page)));
}
