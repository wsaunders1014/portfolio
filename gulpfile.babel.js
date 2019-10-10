const gulp = require('gulp');
var babel = require('gulp-babel');
var less = require("gulp-less")
var cleanCSS = require("gulp-clean-css");
var imagemin= require("gulp-imagemin");
var livereload = require("gulp-livereload");
var plumber = require("gulp-plumber");
var rename =require("gulp-rename");
var sourcemaps =require( "gulp-sourcemaps");
var uglify = require("gulp-uglify");
var pump = require("pump");


function compileLess(){
  return gulp
    .src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('dist/css/'))
     
    .pipe(rename({suffix:'.min'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload());
}
function compileJs(cb){
  return pump([
     gulp.src('src/js/*.js'),
    babel({presets:['@babel/preset-env']}),
    gulp.dest('dist/js/'),
     
    uglify(),
    rename({suffix:'.min'}),
    gulp.dest('dist/js/'),
    livereload() 
  ],cb)

}
function buildIndex(){
  return gulp.src('src/**/*.php')
  .pipe(gulp.dest('dist/'))
  .pipe(livereload());
}


function watchFiles(){
  livereload.listen();
  gulp.watch('src/js/*.js', compileJs);
  gulp.watch('src/less/*',compileLess);
  gulp.watch('src/**/*.php', buildIndex);
}

exports.default = watchFiles;