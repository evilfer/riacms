import {NextFunction, Request, Response, Router} from "express";
import {requestLevel} from "../../../common/bundles/page-resolver/request-level";
import {RenderingCache} from "../../orm/cache";
import {BasicServerRequestContext} from "../basic-server-request-context";
import {ServerBundle} from "../server-bundle";
import {renderPageOrAdmin} from "./render-page";

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        router.get("*", (req: Request, res: Response, next: NextFunction) => {
            const level = requestLevel(req);
            const cache = new RenderingCache(this.serverContext.types, this.serverContext.db, level);
            const url = `${req.protocol}://${req.get("host")}${req.url}`;
            const requestContext = new BasicServerRequestContext(this.serverContext, cache, level, {url});

            renderPageOrAdmin(this.serverContext, requestContext)
                .then(({err, stream}) => {
                    if (err) {
                        next(err);
                    } else if (stream) {
                        res.writeHead(200, {"content-type": "text/html"});
                        stream.pipe(res);
                    }
                });
        });

        return router;
    }
}
