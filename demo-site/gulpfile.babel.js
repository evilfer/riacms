import path from "path";
import extend from "extend";
import {initStyleTasks} from "../build-scripts/build-style";
import {initServerTask} from "../build-scripts/build-server";
import tsConfig from "../tsconfig.json";
import {initWebpackTasks} from "../build-scripts/build-webpack";


initStyleTasks({
    devPath: './build/dev/_assets/',
    prodPath: './build/prod/_assets/'
}, {style: './src/template/style.scss'});

initServerTask({
    src: [
        path.join(__dirname, "../**/*.ts"),
        path.join(__dirname, "../**/*.tsx"),
        `!${path.join(__dirname, "../node_modules/**/*")}`,
        `!${path.join(__dirname, "../test/**/*")}`
    ],
    devPath: path.join(__dirname, './build/dev/'),
    prodPath: path.join(__dirname, './build/prod/'),
    tsConfig: extend({}, tsConfig, {
        compilerOptions: extend({}, tsConfig.compilerOptions, {
            rootDir: path.join(__dirname, "../"),
        })
    }),
    base: path.join(__dirname, '../')
});


initWebpackTasks({
    admin: "../src/client/admin/index"
});
