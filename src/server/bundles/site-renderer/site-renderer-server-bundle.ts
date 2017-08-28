import {NextFunction, Request, Response, Router} from "express";
import {requestLevel} from "../../../common/bundles/page-resolver/request-level";
import {RenderingCache} from "../../orm/server-cache";
import {BasicServerRequestContext} from "../basic-server-request-context";
import {ServerBundle} from "../server-bundle";
import {renderPageOrAdmin} from "./render-page";
import {obj2query} from "../../../common/utils/object-to-query";

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
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
