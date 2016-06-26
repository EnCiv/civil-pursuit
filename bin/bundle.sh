#!/usr/bin/bash

browserify dist/client/main.js -t babelify -o assets/js/main.js
