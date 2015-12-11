#!/bin/bash

node dist/lib/util/minify-css.js \
  assets/css/index.css \
  assets/css/index.min.css || {
  echo Could not minfiy index;
  exit 1
}

node dist/lib/util/minify-css.js \
  assets/css/training.css \
  assets/css/training.min.css || {
  echo Could not minfiy training;
  exit 1
}

cat assets/css/normalize.min.css assets/bower_components/c3/c3.min.css  > assets/css/assets.min.css || {
  echo could not cat assets;
  exit 1;
}

echo "min css ok"
