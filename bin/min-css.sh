#!/usr/bin/bash

node dist/lib/build/minify.js assets/css/index.css assets/css/index.min.css &&

#
# node dist/lib/build/minify.js assets/bower_components/goalProgress/goalProgress.css assets/css/.goalProgress.min.css;
#
cat assets/css/normalize.min.css assets/bower_components/c3/c3.min.css  > assets/css/assets.min.css

echo "min css ok"
