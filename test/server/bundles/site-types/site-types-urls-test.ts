import {expect} from "chai";
import {ServerContext} from "../../../../src/server/app/server-context";
import {
    flattenNodeUrls,
    SiteNodeFlatUrl
} from "../../../../src/server/bundles/site-types/site-node-urls/flatten-node-urls";
import {siteNodeUrls,} from "../../../../src/server/bundles/site-types/site-node-urls/site-types-urls";
import {RenderingCache} from "../../../../src/server/orm/server-cache";
import {createFixtureServerContext} from "../../utils/fixture-server-context";
import {fixtures, types} from "../site-fixtures";
import {ResolvedPageData} from "../../../../src/common/bundles/page-resolver/resolved-page-data";
import {closestFlatUrl} from "../../../../src/server/bundles/site-types/site-node-urls/closest-url";

describe("site types: urls computed field", () => {
    describe("site node urls", () => {
        let context: ServerContext;
        let cache: RenderingCache;

        beforeEach(() => {
            context = createFixtureServerContext([], types, fixtures);
            cache = new RenderingCache(types, context.db, 0);
        });

        beforeEach(() => {
            context = createFixtureServerContext([], types, fixtures);
        });

        it("should calculate urls of site", () => {
            return siteNodeUrls(cache, 1)
                .then(data => {
                    expect(data).to.deep.eq([{
                        id: 1,
                        next: null,
                        segments: [{ssl: false, host: "host1:1000"}],
                    }]);
                });
        });

        it("should calculate urls of top level page", () => {
            return siteNodeUrls(cache, 12)
                .then(data => {
                    expect(data).to.deep.eq([{
                        id: 1,
                        next: {
                            id: 12,
                            next: null,
                            segments: ["about"],
                        },
                        segments: [{ssl: false, host: "host1:1000"}],
                    }]);
                });
        });

        it("should calculate urls of second level page", () => {
            return siteNodeUrls(cache, 121)
                .then(data => {
                    expect(data).to.deep.eq([{
                        id: 1,
                        next: {
                            id: 12,
                            next: {id: 121, next: null, segments: ["ria"]},
                            segments: ["about"],
                        },
                        segments: [{ssl: false, host: "host1:1000"}],
                    }]);
                });
        });

        it("should calculate urls of home page", () => {
            return siteNodeUrls(cache, 11)
                .then(data => {
                    expect(data).to.deep.eq([{
                        id: 1,
                        next: {
                            id: 11,
                            next: null,
                            segments: ["home", ""],
                        },
                        segments: [{ssl: false, host: "host1:1000"}],
                    }]);
                });
        });

        it("should calculate urls of pages with multiple parents", () => {
            return siteNodeUrls(cache, 122)
                .then(data => {
                    expect(data).to.deep.eq([{
                        id: 1,
                        next: {
                            id: 12,
                            next: {
                                id: 122,
                                next: null,
                                segments: ["ria2"],
                            },
                            segments: ["about"],
                        },
                        segments: [{ssl: false, host: "host1:1000"}],
                    }, {
                        id: 2,
                        next: {
                            id: 22,
                            next: {
                                id: 122,
                                next: null,
                                segments: ["ria2"],
                            },
                            segments: ["about"],
                        },
                        segments: [{ssl: false, host: "*"}, {ssl: true, host: "*"}],
                    }]);
                });
        });
    });

    describe("flatten node urls", () => {
        it("should flatten multiple urls", () => {
            expect(flattenNodeUrls([{
                id: 1,
                next: {
                    id: 12,
                    next: {
                        id: 122,
                        next: null,
                        segments: ["ria2"],
                    },
                    segments: ["about"],
                },
                segments: [{ssl: false, host: "host1:1000"}],
            }, {
                id: 2,
                next: {
                    id: 22,
                    next: {
                        id: 122,
                        next: null,
                        segments: ["ria2"],
                    },
                    segments: ["about"],
                },
                segments: [{ssl: false, host: "*"}, {ssl: true, host: "*"}],
            }])).to.deep.eq([
                [
                    [1, {ssl: false, host: "host1:1000"}],
                    [12, "about"],
                    [122, "ria2"],
                ],
                [
                    [2, {ssl: false, host: "*"}],
                    [22, "about"],
                    [122, "ria2"],
                ],
                [
                    [2, {ssl: true, host: "*"}],
                    [22, "about"],
                    [122, "ria2"],
                ],
            ]);
        });

        it("should flatten home page", () => {
            expect(flattenNodeUrls([{
                id: 1,
                next: {
                    id: 11,
                    next: null,
                    segments: ["home", ""],
                },
                segments: [{ssl: false, host: "host1:1000"}],
            }])).to.deep.eq([
                [
                    [1, {ssl: false, host: "host1:1000"}],
                    [11, "home"],
                ],
                [
                    [1, {ssl: false, host: "host1:1000"}],
                    [11, ""],
                ],
            ]);
        });

    });

    describe("closest url", () => {
        it("should find closest urls", () => {
            const urls: SiteNodeFlatUrl[] = [
                [
                    [1, {ssl: false, host: "host1:1000"}],
                    [12, "about"],
                    [122, "ria2"],
                ],
                [
                    [2, {ssl: false, host: "*"}],
                    [22, "about"],
                    [122, "ria2"],
                ],
                [
                    [2, {ssl: true, host: "*"}],
                    [22, "about"],
                    [122, "ria2"],
                ],
            ];

            const resolvedPage: ResolvedPageData = {
                admin: false,
                found: true,
                level: 0,
                loading: false,
                page: {entity: {id: 122}},
                path: "about/ria2",
                pathSegments: ["about", "ria2"],
                route: [
                    {entity: {id: 22}},
                    {entity: {id: 122}},
                ],
                site: {entity: {id: 2}},
                ssl: true,
            };

            expect(closestFlatUrl(resolvedPage, urls)).to.deep.eq([
                [2, {ssl: true, host: "*"}],
                [22, "about"],
                [122, "ria2"],
            ]);
        });
    });
});
