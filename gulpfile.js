const {src,dest,watch,series} = require('gulp');
const sass = require('gulp-sass') (require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

function scssTask(){
    return src('app/scss/style.scss', {sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', {sourcemaps: '.'}));
}

function jsTask(){
    return src('app/js/script.js', {sourcemaps: true})
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(terser())
    .pipe(dest('dist', {sourcemaps: '.'}));
}

function browserSyncServe(cb){
    browserSync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}
function browserSyncReload(cb){
    browserSync.reload();
    cb();
}

function watchTask(){
    watch('*.html', browserSyncReload);
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browserSyncReload));
}
exports.default = series( scssTask, jsTask, browserSyncServe, watchTask);
exports.build = series( scssTask, jsTask);