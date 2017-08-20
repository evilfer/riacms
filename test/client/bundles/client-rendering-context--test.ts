import {expect} from "chai";
import {ClientRenderingContextBundle} from "../../../src/client/bundles/rendering-context/client-rnd-context-bundle";

describe("client site types bundle", () => {

    it("should create site related types", () => {
        const bundle: ClientRenderingContextBundle = new ClientRenderingContextBundle();
        const stores = bundle.createStores();
        expect(stores).to.deep.eq({
            renderingContext: {
                context: "client",
            },
        });
    });
});
