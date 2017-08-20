/* tslint:disable */
import {expect, use} from "chai";
import * as sinon from "sinon";
import {SinonSpy} from "sinon";
import * as sinonChai from "sinon-chai";
import {ClientRequestLocationBundle,} from "../../../../src/client/bundles/request-location/client-request-location-bundle";
import {ClientHistory, ClientLocation} from "../../../../src/client/bundles/request-location/client-history";

use(sinonChai);

class DummyHistory implements ClientHistory {
    private location: ClientLocation = {
        hash: "",
        hostname: "",
        pathname: "",
        port: "",
        search: "",
        protocol: "",
    };

    private callbacks: Array<(location: ClientLocation) => void> = [];

    public init(protocol: string,
                hostname: string,
                port: string,
                pathname: string,
                search: string) {
        this.location.protocol = protocol;
        this.location.hostname = hostname;
        this.location.port = port;
        this.location.pathname = pathname;
        this.location.search = search;
    }

    public current(): ClientLocation {
        return this.location;
    }

    public onChange(callback: (location: ClientLocation) => void): void {
        this.callbacks.push(callback);
    }

    public goto(path: string, search: string = ""): void {
        this.location.pathname = path;
        this.location.search = search;
        this.callbacks.forEach(cb => cb(this.location));
    }
}

describe("client request location bundle", () => {

    let bundle: ClientRequestLocationBundle;
    let history: DummyHistory;

    beforeEach(() => {
        history = new DummyHistory();
        sinon.spy(history, "current");
        sinon.spy(history, "onChange");

        bundle = new ClientRequestLocationBundle(history);
    });

    afterEach(() => {
        (history.current as SinonSpy).restore();
        (history.onChange as SinonSpy).restore();
    });

    it("should register history listener on launch", () => {
        bundle.createStores();
        expect(history.current).to.have.been.calledOnce;
        expect(history.onChange).to.have.been.calledOnce;
    });

    it("should load initial url", () => {
        history.init("https",
            "h1",
            "1234",
            "/a/b/c",
            "?a=1234&b=ABCD"
        );

        let stores = bundle.createStores();
        expect(stores).not.to.be.null;

        if (stores !== null) {
            const location = stores.location;

            expect(location.hostname).to.equal("h1");
            expect(location.path).to.equal("/a/b/c");
            expect(location.port).to.equal(1234);
            expect(location.protocol).to.equal("https");
            expect(location.query.toJS()).to.deep.eq({a: "1234", b: "ABCD"});
        }
    });

    it("should update url", () => {
        history.init("https",
            "h1",
            "1234",
            "/a/b/c",
            "?a=1234&b=ABCD"
        );

        let stores = bundle.createStores();

        history.goto("/b", "?a=5678&c=new");

        if (stores !== null) {
            const location = stores.location;

            expect(location.hostname).to.equal("h1");
            expect(location.path).to.equal("/b");
            expect(location.port).to.equal(1234);
            expect(location.protocol).to.equal("https");
            expect(location.query.toJS()).to.deep.eq({a: "5678", c: "new"});
        }
    });

});
