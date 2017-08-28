import path from "path";
import extend from "extend";
import {initStyleTasks} from "../build-scripts/build-style";
import {initServerTask} from "../build-scripts/build-server";
import tsConfig from "../tsconfig.json";
import {initWebpackTasks} from "../build-scripts/build-webpack";
import {initAdminTasks} from "../build-scripts/build-admin";

const outputPath = path.join(__dirname, './build');

initStyleTasks({
    outputPath
}, {style: path.join(__dirname, './src/template/style.scss')});

initServerTask({
    src: [
        path.join(__dirname, "../**/*.ts"),
        path.join(__dirname, "../**/*.tsx"),
        `!${path.join(__dirname, "../node_modules/**/*")}`,
        `!${path.join(__dirname, "../test/**/*")}`
    ],
    outputPath,
    tsConfig: extend({}, tsConfig, {
        compilerOptions: extend({}, tsConfig.compilerOptions, {
            rootDir: path.join(__dirname, "../"),
        })
    }),
    base: path.join(__dirname, '../')
});


initWebpackTasks({
    outputPath
}, {
    admin: "../src/client/admin/index"
});


initAdminTasks({outputPath});
