import gulp from "gulp";

const MODES = ['dev', 'prod'];

export function initAssetTasks(options, entries) {
    Object.keys(entries).forEach(name => {
        let sources = entries[name];
        MODES.forEach(mode => {
            let outputPath = `${options.outputPath}/${mode}/_assets/${name}`;
            gulp.task(`assets-${mode}-${name}`, () => {
                sources.forEach(({src, out}) => {
                    gulp.src(src)
                        .pipe(gulp.dest(`${outputPath}/${out}`));
                })
            });
        });
    });
}
