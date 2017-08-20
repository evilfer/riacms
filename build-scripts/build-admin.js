import {initWebpackTasks} from "./build-webpack-sep";
import {initStyleTasks} from "./build-style";

export function initAdminTasks(options) {
    initStyleTasks({
        outputPath: options.outputPath
    }, {admin: './src/common/admin/template/index.scss'});

    initWebpackTasks({
        outputPath: options.outputPath
    }, {
        admin: "./src/client/admin/index"
    });
}
