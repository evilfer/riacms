import {NextFunction, Request, Response, Router} from "express";
import {RenderingCache} from "../../orm/cache";
import {ServerBundle} from "../server-bundle";
import {renderPage} from "./render-page";
import {BasicServerRequestContext} from "../basic-server-request-context";

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        router.get("*", (req: Request, res: Response, next: NextFunction) => {
            const level = 0;
            const cache = new RenderingCache(this.serverContext.types, this.serverContext.db, level);
            const requestContext = new BasicServerRequestContext(this.serverContext, cache, level, req);

            renderPage(this.serverContext, requestContext).then(({err, stream}) => {
                if (err) {
                    next(err);
                } else if (stream) {
                    res.pipe(stream);
                }
            });
        });

        return router;
    }
}
