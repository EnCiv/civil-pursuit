#!/bin/bash

node dist/lib/util/minify-css.js \
  dist-assets/css/index.css \
  dist-assets/css/index.min.css || {
  echo Could not minfiy index;
  exit 1
}

node dist/lib/util/minify-css.js \
  dist-assets/css/training.css \
  dist-assets/css/training.min.css || {
  echo Could not minfiy training;
  exit 1
}

node dist/lib/util/minify-css.js \
  assets/css/normalize.css \
  assets/css/normalize.min.css || {
  echo Could not minfiy normalize;
  exit 1
}

cat assets/css/normalize.min.css assets/bower_components/c3/c3.min.css  > dist-assets/css/assets.min.css || {
  echo could not cat assets;
  exit 1;
}

echo "min css ok"
