#!/usr/bin/bash

browserify dist/client/main.js --require dist/client/bconsole.js:bconsole -o assets/js/main.js
