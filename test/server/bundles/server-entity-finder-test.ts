/* tslint:disable */
import * as Promise from "bluebird";
import {expect} from "chai";
import {SiteTypesBundle} from "../../../src/common/bundles/site-types/site-types-bundle";
import {TypeManager} from "../../../src/common/types/type-manager";
import {TypeManagerBuilder} from "../../../src/common/types/type-manager-builder";
import {ServerContext} from "../../../src/server/app/server-context";
import {createFixtureServerContext} from "../utils/fixture-server-context";
import {fixtures} from "./site-fixtures";
import {RenderingCache} from "../../../src/server/orm/cache";
import {ServerRequestContext} from "../../../src/server/bundles/server-bundle";
import {
    ServerEntityFinderBundle,
    ServerEntityFinderBundleStores
} from "../../../src/server/bundles/entity-finder/server-entity-finder-bundle";
import {EntityFinderStore} from "../../../src/common/bundles/entity-finder/entity-finder-data";
import {EntityFinderError} from "../../../src/server/bundles/entity-finder/entity-finder-error";

describe("server entity finder bundle", () => {
    let context: ServerContext;
    let bundle: ServerEntityFinderBundle;
    let cache: RenderingCache;

    let requestContext: ServerRequestContext;
    let store: EntityFinderStore;
    let declaredStores: ServerEntityFinderBundleStores;

    beforeEach(() => {
        const typesBundle: SiteTypesBundle = new SiteTypesBundle();
        bundle = new ServerEntityFinderBundle();

        const builder: TypeManagerBuilder = new TypeManagerBuilder();
        typesBundle.applyTypes(builder);
        const types: TypeManager = builder.build();

        context = createFixtureServerContext([bundle], types, fixtures);
        bundle.setServerContext(context);
        cache = new RenderingCache(types, context.db, 0);

        requestContext = {
            cache,
            dataService: name => context.dataService(name, requestContext),
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
            return expect(() => store.find("sites", {type: "site"})).to.throw("Missing finder error: [sites] [{\"type\":\"site\"}]");
        });

        it('should recover from errors', () => {
            try {
                store.find("sites", {});
            } catch (e) {
                return (e as EntityFinderError).loadData(cache)
                    .then(loadError => {
                        expect(loadError).to.be.null;
                        let sites: any = null;
                        expect(() => sites = store.find("sites", {})).not.to.throw();
                        expect(sites).not.to.be.null;
                        if (sites !== null) {
                            expect(sites.loading).to.equal(false);
                            expect(sites.data).to.be.an("array");
                        }
                    });
            }
        });

        describe("filtering", () => {
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

            it('should filter by type (page)', () => {
                return find({name: "site1"})
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
                        expect(entities).to.have.length(6);
                        if (entities !== null) {
                            expect(entities.map(p => p._id)).to.deep.eq([11, 12, 13, 121, 21, 22]);
                        }
                    });
            });
        });
    });
});
