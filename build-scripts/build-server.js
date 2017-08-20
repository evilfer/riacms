import gulp from "gulp";
import ts from "gulp-typescript";
import babel from "gulp-babel";
import rename from "gulp-rename";
import filter from "gulp-filter";
import extend from "extend";

export function initServerTask(options) {
    ["prod", "dev"].forEach(mode => {
        let outputPath = `${options.outputPath}/${mode}`;
        let tsProject = ts.createProject(extend({}, options.tsConfig.compilerOptions, {
            declaration: false,
            outDir: outputPath
        }));

        gulp.task(`server-${mode}`, () => {
            return gulp.src(options.src)
                .pipe(tsProject())
                .pipe(filter(['**', '!**/*.d.ts']))
                .pipe(babel({
                    "presets": ["es2015", "react", "stage-1"],
                    "plugins": ["transform-decorators-legacy"]
                }))
                .pipe(rename(function (path) {
                    path.extname = ".js";
                }))
                .pipe(gulp.dest(outputPath));
        });
    });

    gulp.task('server-watch', ['server-dev'], function () {
        return gulp.watch(options.src, ['server-dev']);
    });
}
