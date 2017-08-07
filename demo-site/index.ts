import * as Promise from "bluebird";
import extend = require("extend");
import {PgJsonDb} from "../pgjson-db/src/pgjson-db";
import {Bundle} from "../src/common/bundles/bundle";
import {SiteTypesBundle} from "../src/common/bundles/site-types/site-types-bundle";
import {CmsServerApp} from "../src/server/app/server-app";
import {BasicRendererResolverBundle} from "../src/server/bundles/basic-renderer-resolver/basic-renderer-resolver-bundle";
import {ServerEntityFinderBundle} from "../src/server/bundles/entity-finder/server-entity-finder-bundle";
import {ServerPageResolverBundle} from "../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {RequestLocationBundle} from "../src/server/bundles/request-location/request-location-bundle";
import {SiteRendererServerBundle} from "../src/server/bundles/site-renderer/site-renderer-server-bundle";
import connectionOptions from "./connection-options";

function launch() {
    const bundles: Bundle[] = [
        new SiteTypesBundle(),
        new RequestLocationBundle(),
        new ServerPageResolverBundle(),
        new ServerEntityFinderBundle(),
        new BasicRendererResolverBundle(),
        new SiteRendererServerBundle(),
    ];

    const db = new PgJsonDb(extend({}, connectionOptions, {
        Promise,
        max: 10,
        min: 0,
    }));

    const app: CmsServerApp = new CmsServerApp(bundles, db);
    app.launch(8080);
}

launch();
