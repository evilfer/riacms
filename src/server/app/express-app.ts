import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import * as helmet from "helmet";
import * as logger from "morgan";

export function createExpressApp(routers: Router[]): express.Express {
    const app = express();

    app.use(helmet());
    app.use(logger("dev"));
    app.set("view options", "text");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(cookieParser());

    routers.forEach(router => app.use(router));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message,
        });

        next(err);
    });

    return app;
}
