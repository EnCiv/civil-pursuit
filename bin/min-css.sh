#!/usr/bin/bash

node dist/lib/build/minify.js dist/css/index.css dist/css/index.min.css;

node dist/lib/build/minify.js assets/assets/vex-2.2.1/css/vex.css dist/css/.vex.min.css;

node dist/lib/build/minify.js assets/assets/vex-2.2.1/css/vex-theme-flat-attack.css dist/css/.vex.theme.min.css;

cat dist/css/.vex.min.css dist/css/.vex.theme.min.css > dist/css/vex.min.css;

node dist/lib/build/minify.js assets/assets/toolkit/tooltip.css dist/css/.tooltip.min.css;

node dist/lib/build/minify.js assets/bower_components/goalProgress/goalProgress.css dist/css/.goalProgress.min.css;

cat assets/css/normalize.min.css dist/css/vex.min.css dist/css/.tooltip.min.css assets/bower_components/c3/c3.min.css dist/css/.goalProgress.min.css > dist/css/assets.min.css