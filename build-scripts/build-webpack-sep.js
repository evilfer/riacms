import fs from "fs";
import gulp from "gulp";
import webpack from "webpack";
import gutil from "gulp-util";

const libraries = ['react', 'react-dom', 'antd'];

function initWebpackLib(name, outputPath) {
    const cfg = {
        entry: {
            'libs': libraries
        },
        output: {
            path: outputPath,
            filename: 'libs.js',
            library: 'libs',
        },
        plugins: [
            new webpack.DllPlugin({
                path: `${outputPath}/libs-manifest.json`,
                name: 'libs'
            }),
        ],
    };

    gulp.task(`webpack-${name}-libs`, () => {
        return webpack(cfg, (err, stats) => {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({modules: false}));
        });
    });
}

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
                let manifest = null;

                if (!isProd) {
                    initWebpackLib(name, output);
                    const manifestContent = fs.readFileSync(`${output}/libs-manifest.json`);
                    manifest = JSON.parse(manifestContent)
                }

                const commonPlugins = [
                    new webpack.DefinePlugin({'process.env.NODE_ENV': isProd ? '"production"' : '"development"'}),
                    new webpack.ProvidePlugin({Promise: 'bluebird'})
                ];
                const plugins = isProd ? [...commonPlugins, new webpack.optimize.UglifyJsPlugin({
                    output: {comments: false},
                    sourceMap: false
                })] : [
                    ...commonPlugins,
                    new webpack.DllReferencePlugin({
                        context: '.',
                        manifest
                    }),
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
                        loaders: [
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
                                        loader: "ts-loader?configFileName=./tsconfig.webpack.json"
                                    }
                                ]
                            },
                            // {
                            //     test: /\.s?css$/,
                            //     loader: ExtractTextPlugin.extract({
                            //         fallback: "style-loader",
                            //         use: ["css-loader", "sass-loader"]
                            //     })
                            // }
                        ]
                    }
                };

                gulp.task(`webpack-${name}-${mode}`, () => {
                    return webpack(cfg, (err, stats) => {
                        if (err) throw new gutil.PluginError("webpack", err);
                        gutil.log("[webpack]", stats.toString({modules: false}));
                    });
                });
            });
        }
    });
}
