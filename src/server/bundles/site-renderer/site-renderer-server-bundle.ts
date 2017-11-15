import * as Promise from "bluebird";
import {NextFunction, Request, Response, Router} from "express";
import {requestLevel} from "../../../common/bundles/page-resolver/request-level";
import {DynamicDataModeStore} from "../../../common/bundles/site-renderer/dynamic-data";
import {obj2query} from "../../../common/utils/object-to-query";
import {RenderingCache} from "../../orm/server-cache";
import {BasicServerRequestContext} from "../basic-server-request-context";
import {ServerBundle, ServerBundleDataInitMap, ServerRequestContext} from "../server-bundle";
import {renderPageOrAdmin} from "./render-page";

export interface SiteRendererServerBundleStores extends ServerBundleDataInitMap {
    dynamicData: (context: ServerRequestContext) => Promise<DynamicDataModeStore>;
}

const SERVER_DD_STORE: DynamicDataModeStore = {
    currentDynamicBlock: () => 0,
    enterDynamicBlock: () => {
        return;
    },
    exitDynamicBlock: () => {
        return;
    },
    generateUUID: () => 1,
    getBlockDataVersion: () => 0,
};

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
    }

    public declareRenderingStores(): SiteRendererServerBundleStores {
        return {
            dynamicData: () => Promise.resolve(SERVER_DD_STORE),
        };
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        const generateHandler = (onlyJson: boolean) => {
            const contentType = onlyJson ? "application/json" : "text/html";
            return (req: Request, res: Response, next: NextFunction) => {
                const level = requestLevel(req);
                const cache = new RenderingCache(this.serverContext.types, this.serverContext.db, level);
                const url = `${req.protocol}://${req.get("host")}${req.params.path}${obj2query(req.query)}`;
                const requestContext = new BasicServerRequestContext(this.serverContext, cache, level, {url});

                cache.setContext(this.serverContext, requestContext);

                renderPageOrAdmin(this.serverContext, requestContext, onlyJson)
                    .then(({err, stream}) => {
                        if (err) {
                            next(err);
                        } else if (stream) {
                            res.writeHead(200, {"content-type": contentType});
                            stream.pipe(res);
                        }
                    });
            };
        };

        router.get("/_api/render:path(/*)", generateHandler(true));
        router.get(":path(*)", generateHandler(false));

        return router;
    }
}
