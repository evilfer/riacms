import path from "path";
import {initWebpackTasks} from "./build-webpack-sep";
import {initStyleTasks} from "./build-style";
import {initAssetTasks} from "./build-assets";

export function initAdminTasks(options) {
    initStyleTasks({
        outputPath: options.outputPath
    }, {admin: path.join(__dirname, '../src/common/admin/template/index.scss')});

    initWebpackTasks({
        outputPath: options.outputPath
    }, {
        admin: path.join(__dirname, "../src/client/admin/admin-index")
    });

    initAssetTasks({
        outputPath: `${options.outputPath}`
    }, {
        admin: [{
            src: path.join(__dirname, "../node_modules/semantic-ui-css/themes/**/*"),
            out: "themes"
        }]
    })
}
