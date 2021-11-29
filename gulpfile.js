//============================
const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
// const include = require('gulp-file-include');
// const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const del = require('del');
// const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const webp = require('gulp-webp');

// function html() {
//     return src('app/**.html')
//         .pipe(
//             include({
//                 prefix: '@@',
//             })
//         )
//         .pipe(
//             htmlmin({
//                 collapseWhitespace: true,
//             })
//         )
//         .pipe(dest('dist'));
// }

function images() {
    return src('app/images-tmp/**/*')
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(webp())
        .pipe(dest('app/images/'));
}

function scss() {
    return src('app/sass/**.sass')
        .pipe(sass())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
            })
        )
        .pipe(csso())
        .pipe(dest('app/css'));
}

function watching() {
    sync.init({
        server: './app',
    });

    watch('app/**.html').on('change', sync.reload);
    watch('app/sass/**.sass', series(scss)).on('change', sync.reload);
}

function dist() {
    return src(['app/css/**/*', 'app/*.html'], { base: 'app' }).pipe(dest('dist'));
}

function clear() {
    return del('dist');
}

// function derd() {
//     return src(['app/images/**/*.svg', 'app/fonts/**/*'], { base: 'app' }).pipe(dest('dist'));
// }

exports.images = images;
exports.build = series(clear, dist);
exports.default = series(scss, watching);
exports.clear = clear;
