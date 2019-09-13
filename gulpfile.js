const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const sass = require("gulp-dart-sass");


const config = {
    tsSourceGlob: 'src/*.ts',
    sassSourceGlob: 'src/main.scss',
    dist: 'dist',
};

gulp.task("compile:sass", done => {
    gulp.src(config.sassSourceGlob)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.dist));
    done();
}); 

gulp.task('lint:ts', () =>
    gulp.src(config.tsSourceGlob)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report())
);

const tsResult = () => {
	const tsProject = ts.createProject('tsconfig.json');

	return tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject().on('error', function () {
			process.exit(1)
		}))
};

gulp.task('build:ts:dts',
	() => tsResult().dts
		.pipe(concat(config.dtsBundle))
		.pipe(gulp.dest(config.dist))
);

gulp.task('build:js',
	() => tsResult().js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.dist))
);


gulp.task('default', gulp.parallel('build:js', 'compile:sass'));