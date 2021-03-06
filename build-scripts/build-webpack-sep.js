import path from "path";
import fs from "fs";
import gulp from "gulp";
import webpack from "webpack";
import gutil from "gulp-util";

const libraries = [
    'axios',
    'bluebird',
    'classnames',
    'extend',
    'he',
    'mobx',
    'mobx-react',
    'react',
    'react-dom',
    'react-helmet',
];

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

    gulp.task(`${name}-webpack-libs`, () => {
        return webpack(cfg, (err, stats) => {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({modules: false}));
        });
    });
}

const tsConfigFile = path.join(__dirname, '../tsconfig.webpack.json');

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
                    try {
                        fs.statSync(`${output}/libs-manifest.json`);
                    } catch (e) {
                        return;
                    }

                    const manifestContent = fs.readFileSync(`${output}/libs-manifest.json`);
                    manifest = JSON.parse(manifestContent)
                }

                const commonPlugins = [
                    new webpack.DefinePlugin({'process.env.NODE_ENV': isProd ? '"production"' : '"development"'}),
                    new webpack.ProvidePlugin({Promise: 'bluebird'})
                ];
                const plugins = isProd ? commonPlugins : [
                    ...commonPlugins,
                    new webpack.DllReferencePlugin({
                        context: '.',
                        manifest
                    }),
                ];

                const cfg = {
                    entry: entries[name],
                    watch: doWatch,
                    mode: isProd ? "production" : "development",
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
                                        loader: `ts-loader?configFile=${tsConfigFile}`
                                    }
                                ]
                            },
                        ]
                    },
                    optimization: {
                        minimize: isProd
                    }
                };
                console.log(`${name}-webpack-${mode}`);

                gulp.task(`${name}-webpack-${mode}`, () => {
                    return webpack(cfg, (err, stats) => {
                        if (err) throw new gutil.PluginError("webpack", err);
                        gutil.log("[webpack]", stats.toString({
                            modulesSort: "!size",
                            excludeModules: /!!!none!!!/,
                            maxModules: 1000
                        }));
                    });
                });
            });
        }
    });
}
