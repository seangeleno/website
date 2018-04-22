
DERO official website source
https://dero.io 



Don´t modify content at dist folder directly.
User src folder and Gulp:

1 --------------------

Install/Update NODE.js latest stable
nodejs.org
- All terminal from here on.
- Move to project folder in terminal
- run commands as sudo in case of error.

2 --------------------

Install Gulp JS (gulpjs.com)

npm install gulp-cli -g

npm install gulp -D

touch gulpfile.js

gulp --help

3 --------------------
- Install all modules used in gulp.js (read below for individual install)

npm install npm-install-all -g

npm-install-all gulpfile.js (run this twice just in case)


4 --------------------

Run GULP
$ gulp (run this twice if something fails 1st time. Check gulpfile.js for all available tasks)




------------------------------------------------------
Detailed explain:
------------------------------------------------------

The app uses the following modules in gulpfile.js :

--  inject partials to add html partials to index.html [https://www.npmjs.com/package/gulp-inject-partials]
npm install  gulp-inject-partials

--  Browser Sync to refresh browser when coding less, js, etc [https://www.browsersync.io/docs/gulp]
npm install browser-sync gulp 

--  plumber  to use pipe and concat events [https://www.npmjs.com/package/gulp-plumber]
npm install  gulp-plumber

--  Less to compile less into css [https://www.npmjs.com/package/gulp-less]
npm install gulp-less

-- cssmin o compress stylesheet [https://www.npmjs.com/package/gulp-cssmin]
npm install  gulp-cssmin

-- concat to unify js files into single one [https://www.npmjs.com/package/gulp-concat/]
npm install  gulp-concat

-- htmlmin to minify final html [https://www.npmjs.com/package/gulp-htmlmin]
npm install  gulp-htmlmin

-- cssmin to minify final css [https://www.npmjs.com/package/gulp-cssmin]
npm install  gulp-cssmin

-- asset version to version the assets for caching [https://www.npmjs.com/package/gulp-html-assets]
npm install  gulp-html-assets


The "dist" folder will be created. Everytime you modify a less, html or js,
you should inmediatelly see the files go into dist folder minified.. also the browser will refresh
whenever this files are modified

RUN GULP will compiles less and app.js. minify and run browser sync.
gulp

To add new JS depencencies, libraries, etc. paste files into "./src/js/deps" then rund command
gulp compile_js_deps

