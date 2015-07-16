#!/usr/bin/bash

browserify dist/pages/home/ctrl.js -o dist/pages/home/bundle.js;

browserify dist/pages/profile/ctrl.js -o dist/pages/profile/bundle.js;

browserify dist/pages/not-found/ctrl.js -o dist/pages/not-found/bundle.js;

browserify dist/pages/terms-of-service/ctrl.js -o dist/pages/terms-of-service/bundle.js;

browserify dist/pages/error/ctrl.js -o dist/pages/error/bundle.js