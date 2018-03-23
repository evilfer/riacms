/* tslint:disable */
import * as Promise from "bluebird";
import {expect} from "chai";
import {TypeManager} from "../../../src/common/types/type-manager";
import {ServerContext} from "../../../src/server/app/server-context";
import {createFixtureServerContext} from "../utils/fixture-server-context";
import {fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../src/server/orm/server-cache";
import {ServerRequestContext} from "../../../src/server/bundles/server-bundle";
import {
    ServerEntityFinderBundle,
    ServerEntityFinderBundleStores
} from "../../../src/server/bundles/entity-finder/server-entity-finder-bundle";
import {EntityFinderStore} from "../../../src/common/bundles/entity-finder/entity-finder-data";
import {EntityFinderError} from "../../../src/server/bundles/entity-finder/entity-finder-error";
import {ServerSiteTypesBundle} from "../../../src/server/bundles/site-types/server-site-types-bundle";
import {ServerTypeManagerBuilder} from "../../../src/server/entity/server-types";

describe("server entity finder bundle", () => {
    let context: ServerContext;
    let bundle: ServerEntityFinderBundle;
    let cache: RenderingCache;

    let requestContext: ServerRequestContext;
    let store: EntityFinderStore;
    let declaredStores: ServerEntityFinderBundleStores;

    beforeEach(() => {
        const typesBundle: ServerSiteTypesBundle = new ServerSiteTypesBundle();
        bundle = new ServerEntityFinderBundle();

        const builder: ServerTypeManagerBuilder = new ServerTypeManagerBuilder();
        typesBundle.applyTypes(builder);
        const types: TypeManager = builder.build();

        context = createFixtureServerContext([bundle], types, fixtures);
        bundle.setServerContext(context);
        cache = new RenderingCache(types, context.db, 0);

        requestContext = {
            cache,
            dataService: name => context.bundles.dataService(name, requestContext),
            level: 0,
            req: {url: "http://host1:1000"},
        };

        declaredStores = bundle.declareRenderingStores() as ServerEntityFinderBundleStores;

        return declaredStores.entityFinder(requestContext)
            .then(newStore => {
                store = newStore;
            })
    });


    describe('store', () => {
        const find: (query: { [field: string]: number | boolean | string }) => Promise<null | any[]> =
            query => {
                try {
                    store.find("name", query);
                    return Promise.resolve(null);
                } catch (e) {
                    return (e as EntityFinderError).loadData(cache)
                        .then(() => store.find("name", query).data);
                }
            };

        it("should define entityFinder store", () => {
            expect(declaredStores).not.to.be.null;
            if (declaredStores !== null) {
                expect(declaredStores.entityFinder).to.be.a("function");
            }
        });

        it('should have find function', () => {
            expect(store.find).to.be.a("function");
        });

        it('should throw error on missing data', () => {
            expect(() => store.find("sites", {_type: "site"})).to.throw("Missing finder error: [sites] [{\"_type\":\"site\"}]");
        });

        it('should recover from errors', () => {
            try {
                store.find("sites", {_type: "site"});
            } catch (e) {
                return (e as EntityFinderError).loadData(cache)
                    .then(loadError => {
                        expect(loadError).to.be.null;
                        let sites: any = null;
                        expect(() => sites = store.find("sites", {_type: "site"})).not.to.throw();
                        expect(sites).not.to.be.null;
                        if (sites !== null) {
                            expect(sites.loading).to.equal(false);
                            expect(sites.data).to.be.an("array");
                        }
                    });
            }
        });

        it('should throw error on missing id', () => {
            expect(() => store.byId(1)).to.throw("Missing: [1]");
        });

        it('should retrieve entity by id', () => {
            return cache.loadEntity(1)
                .then(() => {
                    expect(store.byId(1)).to.be.an("object");
                    expect(store.byId(1).loading).to.equal(false);
                    expect(store.byId(1).entity._id).to.equal(1);
                });
        });

        describe("filtering", () => {
            it('should filter by type (page)', () => {
                return find({_type: "site", name: "site1"})
                    .then(entities => {
                        expect(entities).to.have.length(1);
                        if (entities !== null) {
                            expect(entities.map(p => p._id)).to.deep.eq([1]);
                        }
                    });
            });

            it('should filter by field value', () => {
                return find({_type: "page"})
                    .then(entities => {
                        expect(entities).to.have.length(7);
                        if (entities !== null) {
                            expect(entities.map(p => p._id)).to.deep.eq([11, 12, 13, 21, 22, 121, 122]);
                        }
                    });
            });
        });

        describe("to client data", () => {

            it("should convert data to client", () => {
                return find({_type: "site", name: "site1"})
                    .then(() => {
                        expect(bundle.storeData2client("entityFinder", store)).to.deep.eq({
                            q: {
                                '{"_type":"site","name":"site1"}': [1],
                            },
                            n: {
                                "name": '{"_type":"site","name":"site1"}',
                            },
                        });
                    });
            });
        });
    });
});
