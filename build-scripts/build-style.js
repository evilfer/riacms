import path from "path";
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import gulpIf from "gulp-if";
import sass from "gulp-sass";
import watch from "gulp-watch";

const MODES = ['dev', 'prod'];

export function initStyleTasks(options, entries) {
    Object.keys(entries).forEach(name => {
        let match = entries[name].match(/(^.*\/)([^/.]+)\.scss$/);
        if (match) {
            let [, src] = match;
            MODES.forEach(mode => {
                let isDev = mode !== 'prod';
                let outputPath = `${options.outputPath}/${mode}/_assets/${name}`;

                gulp.task(`${name}-sass-${mode}`, () => {
                    return gulp.src(entries[name])
                        .pipe(sass().on('error', sass.logError))
                        .pipe(autoprefixer({
                            browsers: ['last 2 versions', '> 1%'],
                            cascade: false
                        }))
                        .pipe(gulpIf(!isDev, cleanCSS()))
                        .pipe(gulp.dest(outputPath));
                });
            });

            gulp.task(`${name}-sass-watch`, [`${name}-sass-dev`], function () {
                return watch(`${src}**/*.scss`, function () {
                    gulp.start(`${name}-sass-dev`);
                });
            });
        }
    });
}
