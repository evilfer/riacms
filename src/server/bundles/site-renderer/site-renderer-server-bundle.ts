import {NextFunction, Request, Response, Router} from "express";
import {requestLevel} from "../../../common/bundles/page-resolver/request-level";
import {RenderingCache} from "../../orm/cache";
import {BasicServerRequestContext} from "../basic-server-request-context";
import {ServerBundle} from "../server-bundle";
import {resolveRendererAndRenderPage} from "./render-page";

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        router.get("*", (req: Request, res: Response, next: NextFunction) => {
            const level = requestLevel(req);
            const cache = new RenderingCache(this.serverContext.types, this.serverContext.db, level);
            const requestContext = new BasicServerRequestContext(this.serverContext, cache, level, req);

            resolveRendererAndRenderPage(this.serverContext, requestContext).then(({err, stream}) => {
                if (err) {
                    next(err);
                } else if (stream) {
                    stream.pipe(res);
                }
            });
        });

        return router;
    }
}
