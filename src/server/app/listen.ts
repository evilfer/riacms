import * as debug from "debug";
import * as express from "express";
import * as http from "http";

export function listen(app: express.Express, port: number) {
    debug.enable("server");
    const logger = debug("server");

    const onError = (error: any) => {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

        switch (error.code) {
            case "EACCES":
                logger("%s requires elevated privileges", bind);
                process.exit(1);
                break;
            case "EADDRINUSE":
                logger("%s is already in use", bind);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    const onListening = (s: http.Server) => {
        const addr = s.address();
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        logger("Listening on %s!", bind);
    };

    logger("Node env: %s", app.get("env"));
    const server = app.listen(port);
    logger("Starting server…");

    server.on("error", onError);
    server.on("listening", onListening.bind(null, server));
}
