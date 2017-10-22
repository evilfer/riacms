import {NextFunction, Request, Response, Router} from "express";
import {ServerBundle} from "../server-bundle";
import {createPage} from "./site-write-ops";

export class EntityWriteBundle extends ServerBundle {
    public getName(): string {
        return "entityWrite";
    }

    public prepareRoutes(): Router {
        const router: Router = Router();

        router.post("/_api/sitetree/:id", (req: Request, res: Response, next: NextFunction) => {
            const {name = null, path = null, type = null} = req.body || {};
            if (name !== null && path !== null && type !== null) {
                const data = [{name, paths: [path]}];
                const {db, types} = this.serverContext;

                return createPage(types, db, 0, parseInt(req.params.id, 10), data, type)
                    .then(entity => res.json({id: entity.id}))
                    .catch(next);

            } else {
                next(new Error("missing data"));
            }
        });

        return router;
    }
}
