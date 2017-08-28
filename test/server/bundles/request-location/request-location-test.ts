/* tslint:disable */
import {expect} from "chai";
import {TypeManager} from "../../../../src/common/types/type-manager";
import {ServerContext} from "../../../../src/server/app/server-context";
import {BasicServerRequestContext} from "../../../../src/server/bundles/basic-server-request-context";
import {
    RequestLocationBundle, RequestLocationBundleServices,
    RequestLocationBundleStores,
} from "../../../../src/server/bundles/request-location/request-location-bundle";
import {ServerRequestContext} from "../../../../src/server/bundles/server-bundle";
import {RenderingCache} from "../../../../src/server/orm/server-cache";
import {createFixtureServerContext} from "../../utils/fixture-server-context";

describe("request location server bundle", () => {
    let bundle: RequestLocationBundle;
    let services: RequestLocationBundleServices;
    let context: ServerContext;
    let createRequestContext: (url: string) => ServerRequestContext;

    beforeEach(() => {
        bundle = new RequestLocationBundle();
        services = bundle.declareRequestDataServices();
        context = createFixtureServerContext([bundle], new TypeManager({}), []);
        createRequestContext = url => new BasicServerRequestContext(
            context,
            new RenderingCache(context.types, context.db),
            0,
            {url},
        );
    });

    it("should parse url without path", () => {
        return services.location(createRequestContext("http://h1")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "",
                port: 80,
                protocol: "http",
                query: new Map(),
            });
        });
    });

    it("should parse url with https protocol", () => {
        return services.location(createRequestContext("https://h1")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "",
                port: 80,
                protocol: "https",
                query: new Map(),
            });
        });
    });

    it("should parse url with port", () => {
        return services.location(createRequestContext("https://h1:1234")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "",
                port: 1234,
                protocol: "https",
                query: new Map(),
            });
        });
    });

    it("should parse url with empty path", () => {
        return services.location(createRequestContext("https://h1:1234/")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "/",
                port: 1234,
                protocol: "https",
                query: new Map(),
            });
        });
    });

    it("should parse url with path", () => {
        return services.location(createRequestContext("https://h1:1234/a/b/c/")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "/a/b/c/",
                port: 1234,
                protocol: "https",
                query: new Map(),
            });
        });
    });

    it("should parse url with query params", () => {
        return services.location(createRequestContext("https://h1:1234/a/b/c/?a=1234&b=ABCD")).then(location => {
            expect(location).to.deep.eq({
                hostname: "h1",
                path: "/a/b/c/",
                port: 1234,
                protocol: "https",
                query: new Map<string, string>([
                    ["a", "1234"],
                    ["b", "ABCD"],
                ]),
            });
        });
    });

    it("should produce no client data", () => {
        return services.location(createRequestContext("https://h1:1234/a/b/c/?a=1234&b=ABCD")).then(location => {
            expect(bundle.storeData2client("location", location)).to.be.null;
        });
    });
});
