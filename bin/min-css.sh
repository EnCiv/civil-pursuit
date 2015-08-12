#!/usr/bin/bash

node dist/lib/build/minify.js assets/css/index.css assets/css/index.min.css &&

# node dist/lib/build/minify.js assets/assets/vex-2.2.1/css/vex.css assets/css/.vex.min.css;
#
# node dist/lib/build/minify.js assets/assets/vex-2.2.1/css/vex-theme-flat-attack.css assets/css/.vex.theme.min.css;
#
# cat assets/css/.vex.min.css assets/css/.vex.theme.min.css > assets/css/vex.min.css;
#
# node dist/lib/build/minify.js assets/assets/toolkit/tooltip.css assets/css/.tooltip.min.css;
#
# node dist/lib/build/minify.js assets/bower_components/goalProgress/goalProgress.css assets/css/.goalProgress.min.css;
#
# cat assets/css/normalize.min.css assets/css/vex.min.css assets/css/.tooltip.min.css assets/bower_components/c3/c3.min.css assets/css/.goalProgress.min.css > assets/css/assets.min.css

echo "min css ok"
