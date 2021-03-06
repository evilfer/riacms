import gulp from "gulp";
import webpack from "webpack";
import gutil from "gulp-util";

export function initWebpackTasks(options, entries) {
    Object.keys(entries).forEach(name => {
        const entry = entries[name];
        const filenameMatch = entry.match(/^(?:.*\/)?([^\/]+)/);
        const filename = filenameMatch && filenameMatch[1];

        if (filename) {
            ["dev", "prod", "watch"].forEach(mode => {
                const isProd = mode === 'prod';
                const doWatch = mode === 'watch';
                const output = `${options.outputPath}/${isProd ? 'prod' : 'dev'}/_assets/${name}`;
                const plugins = [
                    new webpack.DefinePlugin({'process.env.NODE_ENV': isProd ? '"production"' : '"development"'}),
                    new webpack.ProvidePlugin({Promise: 'bluebird'})
                ];

                const cfg = {
                    entry: entries[name],
                    watch: doWatch,
                    output: {
                        path: output,
                        filename: `${filename}.js`
                    },
                    plugins,
                    devtool: !isProd && 'eval-source-map',
                    resolve: {
                        extensions: [".ts", ".tsx", ".js", ".json"]
                    },
                    module: {
                        rules: [
                            {
                                test: /\.tsx?$/,
                                loaders: [
                                    {
                                        loader: "babel-loader",
                                        options: {
                                            presets: ["es2015", "react", "stage-1"],
                                            plugins: ["transform-decorators-legacy"]
                                        }
                                    }, {
                                        loader: "ts-loader?configFile=./tsconfig.webpack.json"
                                    }
                                ]
                            },
                        ]
                    }
                };

                gulp.task(`${name}-webpack-${mode}`, () => {
                    return webpack(cfg, (err, stats) => {
                        if (err) throw new gutil.PluginError("webpack", err);
                        gutil.log("[webpack]", stats.toString({modules: false}));
                    });
                });
            });
        }
    });
}
