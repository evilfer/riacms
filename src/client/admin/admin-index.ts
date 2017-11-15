import {adminTemplate} from "../../common/admin/template/admin-template";
import {CmsClientApp} from "../app/client-app";
import {ClientBundle} from "../bundles/client-bundle";
import {ClientEntityFinderBundle} from "../bundles/entity-finder/client-entity-finder-bundle";
import {ClientPageResolverBundle} from "../bundles/page-resolver/client-page-resolver-bundle";
import {ClientRenderingContextBundle} from "../bundles/rendering-context/client-rnd-context-bundle";
import {BrowserHistory} from "../bundles/request-location/browser-history";
import {ClientRequestLocationBundle} from "../bundles/request-location/client-request-location-bundle";
import {ClientSiteRendererBundle} from "../bundles/site-renderer/client-site-renderer-bundle";
import {ClientSiteTreeBundle} from "../bundles/site-tree/client-site-tree-bundle";
import {ClientSiteTypesBundle} from "../bundles/site-types/client-site-types-bundle";

const bundles: ClientBundle[] = [
    new ClientSiteTypesBundle(),
    new ClientRenderingContextBundle(),
    new ClientRequestLocationBundle(new BrowserHistory()),
    new ClientPageResolverBundle(),
    new ClientEntityFinderBundle(),
    new ClientSiteTreeBundle(),
    new ClientSiteRendererBundle(adminTemplate),
];

const app = new CmsClientApp(bundles);
app.launch();
