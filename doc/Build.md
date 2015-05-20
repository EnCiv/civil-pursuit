B U I L D
===

    File: /app/bin/build.js
    Command: alias syn-build="node app/bin/build"

# Launch all tasks

    syn-build

#  Help

    syn-build --help

Will print this file.

# css

This command will cssify the LESS index file and then minify it into `/dist/css`

    syn-build css

# browserify-pages

This command will browserify all controller files found in `app/pages/*/Controller.js` and output them in the `dist/js` with the `page-` prefix.

    syn-build browserify-pages

## Specify which pages to browserify

Just add the pages separated by spaces

    syn-build browserify-pages Home Item 

## uglify-pages

This command will uglify all the `app/dist/js/page-*.js` and save them as `app/dist/js/page-*.min.js`.

    syn-build uglify-pages
