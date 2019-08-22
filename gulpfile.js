const
    sass = require("gulp-dart-sass"),
    gulp = require("gulp"),
    sourcemaps = require("gulp-sourcemaps");

const paths = {
    sass: `./src/**/*.scss`,
    css: `./dist/`
};

const taskNames = {
    compileSass: "compile:sass",
    main: "main"
};

gulp.task(taskNames.compileSass, done => {
    gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.css));
    done();
}); 

gulp.task("default", gulp.series(taskNames.compileSass));
