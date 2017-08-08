import * as express from "express";
import {Router} from "express";
import {ServerBundle} from "../server-bundle";

export class StaticFilesBundle extends ServerBundle {
    private staticPath: string;

    constructor(staticPath: string) {
        super();
        this.staticPath = staticPath;
    }

    public getName(): string {
        return "staticFiles";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();
        router.use("/_assets", express.static(this.staticPath));
        router.use("/_assets", (req, res) => {
            res.sendStatus(404);
        });
        return router;
    }
}
