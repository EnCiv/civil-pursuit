#!/usr/bin/bash

browserify dist/client/main.js --require bconsole/bconsole.js:bconsole -o assets/js/main.js
