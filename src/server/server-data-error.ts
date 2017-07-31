import * as Promise from "bluebird";
import {RenderingCache} from "./orm/cache";

export abstract class ServerDataError extends Error {
    public abstract loadData(cache: RenderingCache): Promise<null | Error>;
}
