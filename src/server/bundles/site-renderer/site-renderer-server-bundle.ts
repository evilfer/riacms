import {ServerBundle} from "../server-bundle";
import {Router} from "express";

export class SiteRendererServerBundle extends ServerBundle {
    public getName(): string {
        return "siteRenderer";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        //router.get()

        return router;
    }
}
