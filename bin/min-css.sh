#!/bin/bash

echo hello

node dist/lib/build/minify-css.js assets/css/index.css assets/css/index.min.css &&
node dist/lib/build/minify-css.js assets/css/training.css assets/css/training.min.css &&

cat assets/css/normalize.min.css assets/bower_components/c3/c3.min.css  > assets/css/assets.min.css

echo "min css ok"
