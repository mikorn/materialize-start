const gulp = require('gulp')
const autoPrefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const debug = require('gulp-debug')
const del = require('del')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const pngquant = require('imagemin-pngquant')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')

const browserSync = require('browser-sync').create(),
    reload = browserSync.reload

paths = {
    clean: {
        source: [
            './src/*.html',
            './src/libs',
        ],
        dist: [
            './dist/assets',
            './dist/libs'
        ]
    },
    watch: {
        html: './src/pug/**/*.pug',
        css: './src/sass/custom.scss',
        js: './src/assets/js/custom.js',
    },
    source: {
        html: {
            src: './src/pug/pages/*.pug',
            dest: './src'
        },
        css: {
            src: './src/sass/custom.scss',
            dest: './src/assets/css'
        },
        libs: {
            jquery: {
                src: [
                    './src/bower_components/jquery/dist/jquery.min.js',
                    './src/bower_components/jquery/LICENSE.txt'
                ],
                dest: './src/libs/jquery'
            },
            materialize: {
                src: [
                    './src/bower_components/materialize/dist/css/materialize.min.css',
                    './src/bower_components/materialize/dist/js/materialize.min.js',
                    './src/bower_components/materialize/LICENSE'
                ],
                dest: './src/libs/materialize'
            }
        }
    },
    img: {
        src: './src/assets/images/**/*.*',
        dest: './src/dist/assets/images'
    },
    dist: {
        html: {
            src: './src/*.html',
            dest: './dist'
        },
        css: {
            src: './src/assets/css/custom.css',
            dest: './dist/assets/css'
        },
        js: {
            src: './src/assets/js/custom.js',
            dest: './dist/assets/js'
        },
        libs: {
            src: './src/libs/**/*.*',
            dest: './dist/libs'
        }
    }
}

gulp.task('serve', function () {
    browserSync.init({server: './src'})
    gulp.watch(paths.watch.html, gulp.series('html'))
    gulp.watch(paths.watch.css, gulp.series('css'))
    gulp.watch(paths.watch.js).on('change', reload)
    gulp.watch(paths.watch.html).on('change', reload)
});

gulp.task('html', () => {
    return gulp.src(paths.source.html.src)
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.source.html.dest))
        .pipe(browserSync.stream())
})

gulp.task('css', () => {
    return gulp.src(paths.source.css.src)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.source.css.dest))
        .pipe(browserSync.stream())
})

gulp.task('jquery', () => {
    return gulp.src(paths.source.libs.jquery.src)
        .pipe(gulp.dest(paths.source.libs.jquery.dest))
})

gulp.task('materialize', () => {
    return gulp.src(paths.source.libs.materialize.src)
        .pipe(gulp.dest(paths.source.libs.materialize.dest))
})

gulp.task('cleanSrc', () => {
    return del(paths.clean.source)
})

gulp.task('cleanDist', () => {
    return del(paths.clean.dist)
})

gulp.task('htmlDist', () => {
    return gulp.src(paths.dist.html.src)
        .pipe(gulp.dest(paths.dist.html.dest))
})

gulp.task('cssDist', () => {
    return gulp.src(paths.dist.css.src)
        .pipe(gulp.dest(paths.dist.css.dest))
})

gulp.task('jsDist', () => {
    return gulp.src(paths.dist.js.src)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js.dest))
})

gulp.task('imgDist', () => {
    return gulp.src(paths.img.src)
        .pipe(imagemin({use: [pngquant()]}))
        .pipe(gulp.dest(paths.img.dest))
})

gulp.task('libsDist', () => {
    return gulp.src(paths.dist.libs.src)
        .pipe(gulp.dest(paths.dist.libs.dest))
})

gulp.task('src', gulp.parallel('cleanSrc', 'html', 'css'))

gulp.task('libs', gulp.parallel('jquery', 'materialize'))

gulp.task('build', gulp.series('cleanDist', 'htmlDist', 'cssDist', 'jsDist', 'imgDist', 'libsDist'))

gulp.task('default', gulp.series('src', 'libs', 'serve'))
