import {ServerContext} from "../../../../src/server/app/server-context";
import {createFixtureServerContext} from "../../utils/fixture-server-context";
import {fixtures, types} from "../site-fixtures";

describe("site types: urls computed field", () => {
    let context: ServerContext;

    beforeEach(() => {
        context = createFixtureServerContext([], types, fixtures);
    });
});
