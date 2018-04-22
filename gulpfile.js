var gulp = require('gulp');

var injectPartials = require('gulp-inject-partials');

var browserSync = require('browser-sync').create();

var less = require('gulp-less');

var plumber = require('gulp-plumber');

var concat = require('gulp-concat');

var jsmin = require('gulp-jsmin');

var htmlmin = require('gulp-htmlmin');

var rename = require('gulp-rename');

var cssmin = require('gulp-cssmin');

var assetVersion = require('gulp-asset-version');

gulp.task('default', defaultTask);



function defaultTask(done) {
    // place here any task you need to run when executing "$ gulp"
    gulp.start('copy_fonts');
    gulp.start('copy_images');


    //if dependencies JS folder is not created, we compile dependendies
    var fs = require('fs');
    fs.stat('./dist/js/scripts.js', function(err, stat) {
        if(err == null) {
            console.log('Scripts files found');
            gulp.start('watch');
        } else {
            console.log('Compiling JS, this may take a few seonds...');
            gulp.start('compile_js_deps',function(){
                gulp.start('compile_js');
                console.log('Scripts Compiled Run GULP Now');
            });
        }
    });



    //this takes too long. Run it when needed
    //gulp.start('compile_js_deps');
    done();
}


//Place here taks you need to run when saving files (LESS, HTML, JS, etc)
gulp.task('watch',['compile_less','browserSync','partials'], function () {
    //watch changes in css files
    gulp.watch(['./**/*.less'], ['compile_less'] );
    //watch changes in Js files
    gulp.watch(['./**/js/*.js'], ['compile_js'] );
    //watch changes in html files
    gulp.watch(['./**/*.html','./index.html'], ['partials'] );
    // Reloads the browser whenever html, less, etc files change
    gulp.watch('./dist/*.html', browserSync.reload);
});



//gulp index -- construct partials to dist folder. Dependencies injectPartials
gulp.task('partials', function () {
    return gulp.src('./index.html')
        .pipe(injectPartials({
            removeTags: true,
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'));
});


gulp.task('browserSync', function() {
    browserSync.init({
        //browser will refresh when this files change
        files: [
            "./partials/*.html",
            "./dist/*.*",
            "./dist/*.*",
            "./dist/**/*.*"],
        server: {
            baseDir: "./dist"
        }
    });
});


//compile LESS
gulp.task('compile_less', function () {
    return  gulp.src(['./src/less/style.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css/'));

});

//compile js dependencies
gulp.task('compile_js_deps', function(){
    //this takes a bit longer. We run it once at gulp start
    return  gulp.src([
        //files will be added in the following order:
        './src/js/deps/three.min.js',
        './src/js/deps/TweenMax.min.js',
        './src/js/deps/jquery-3.3.1.min.js',
        //any other from here:
        './src/js/deps/*.js'
    ])
        .pipe(jsmin())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist/js/'))
});


//compile and minify js to distribution folder
gulp.task('compile_js', function(){
    //this takes a bit longer. We run it once at gulp start
    return  gulp.src([
        '!src/**/deps*/',      //exclude folders starting with 'deps
        './src/js/*.js'
        ])
        .pipe(jsmin())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js/'))
});


//Copy fonts to distribution folder
gulp.task('copy_fonts', function() {
    gulp.src('./src/fonts/*.*')
        .pipe(gulp.dest('./dist/fonts'));
});


//Copy images to distribution folder
gulp.task('copy_images', function() {
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./dist/img'));
});


gulp.task('html_version',function() {
    gulp.src("./dist/*.html")
        .pipe(assetVersion())
        .pipe(gulp.dest('./dist/compiled/index.html'));
});