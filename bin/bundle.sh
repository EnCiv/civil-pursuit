#!/usr/bin/bash

browserify dist/client/main.js --require ./dist/client/bconsole.js:bconsole --require ./dist/client/socketlogger.js:socketlogger -o assets/webpack/main.js
