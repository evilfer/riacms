import * as Promise from "bluebird";
import * as extend from "extend";
import * as path from "path";
import {PoolConfig} from "pg";
import {PgJsonDb} from "../../pgjson-db/src/pgjson-db";
import {TypeManager} from "../../src/common/types/type-manager";
import {CmsServerApp} from "../../src/server/app/server-app";
import {BasicRendererResolverBundle} from "../../src/server/bundles/basic-renderer-resolver/basic-renderer-resolver";
import {ServerEntityFinderBundle} from "../../src/server/bundles/entity-finder/server-entity-finder-bundle";
import {EntityWriteBundle} from "../../src/server/bundles/entity-write-api/entity-write-bundle";
import {ServerPageResolverBundle} from "../../src/server/bundles/page-resolver/server-page-resolver-bundle";
import {RequestLocationBundle} from "../../src/server/bundles/request-location/request-location-bundle";
import {ServerBundle} from "../../src/server/bundles/server-bundle";
import {SiteRendererServerBundle} from "../../src/server/bundles/site-renderer/site-renderer-server-bundle";
import {ServerSiteTypesBundle} from "../../src/server/bundles/site-types/server-site-types-bundle";
import {StaticFilesBundle} from "../../src/server/bundles/static-files/static-files-bundle";
import connectionOptions from "../settings/connection-options";
import {rendererTemplate} from "./template/renderer-template";

function launch() {
    const bundles: ServerBundle[] = [
        new ServerSiteTypesBundle(),
        new RequestLocationBundle(),
        new ServerPageResolverBundle(),
        new ServerEntityFinderBundle(),
        new BasicRendererResolverBundle({r1: rendererTemplate}),
        new StaticFilesBundle(path.join(__dirname, "../build/dev/_assets")),
        new SiteRendererServerBundle(),
        new EntityWriteBundle(),
    ];

    const dbSettings: PoolConfig = extend({}, connectionOptions, {
        Promise,
        max: 10,
        min: 0,
    });

    const app: CmsServerApp = new CmsServerApp(bundles);
    const types: TypeManager = app.getTypes();

    const db = new PgJsonDb(dbSettings, types);

    app.initServerApp(db);

    app.launch(8080);
}

launch();
