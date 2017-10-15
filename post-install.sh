#!/bin/bash

# node app/models/migrations/v4.js  || exit 11;

echo '*************************************************************************'
echo POSTINSTALL
echo '*************************************************************************'

echo '*************************************************************************'
echo Symbolick link
echo '*************************************************************************'

mkdir node_modules/syn

cp node_modules/babel-polyfill/dist/polyfill.min.js assets/js


echo '*************************************************************************'
echo BOWER
echo '*************************************************************************'

cd assets || {
  echo Could not cd assets;
  exit 1
}
bower install  || {
  echo Could not bower install;
  exit 1
}
cd ..  || {
  echo Could not cd back to root;
  exit 1
}
echo "bower ok"

echo '*************************************************************************'
echo TRANSPILE
echo '*************************************************************************'

npm run transpile  || {
  echo Could not transpile;
  exit 1
}
echo "transpile ok"

echo '*************************************************************************'
echo BROWSERIFY
echo '*************************************************************************'

npm run build  || {
  echo Could not browserify;
  exit 1
}
echo "browserify ok"

echo '*************************************************************************'
echo LESS TO CSS
echo '*************************************************************************'

npm run less  || {
  echo Could not convert less to css;
  exit 1
}
echo "less ok"

echo '*************************************************************************'
echo MINIFY CSS
echo '*************************************************************************'

npm run min-css  || {
  echo Could not minify css;
  exit 1
}
echo "min-css ok"

echo '*************************************************************************'
echo UGLIFY JS
echo '*************************************************************************'

npm run uglify  || {
  echo Could not ulify js;
  exit 1
}
echo "uglify ok"

echo '*************************************************************************'
echo UGLIFY ASSETS
echo '*************************************************************************'

npm run uglify-assets  || {
  echo Could not uglify js;
  exit 1
}
echo "uglify-assets ok"

echo '*************************************************************************'
echo MIGRATE DB
echo '*************************************************************************'

# node dist/bin/migrate  || {
#  echo Could not migrate;
#  exit 1
#}
#echo "migrate ok"

echo '*************************************************************************'
echo CLEAR ERRORS IN DB
echo '*************************************************************************'

#node dist/bin/clear-errors  || {
#  echo Could not clear errors;
#  exit 1
#}
#
#echo "clear errors in db ok"
