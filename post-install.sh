#!/bin/bash

# node app/models/migrations/v4.js  || exit 11;

echo
echo '###'
echo '    BOWER INSTALL'
echo '###'
echo

cd assets
../node_modules/.bin/bower install  || exit 12;
cd ..;

echo
echo '###'
echo '    BABEL'
echo '###'
echo

node_modules/.bin/babel app/ --modules common --stage 1 --out-dir dist/

echo
echo '###'
echo '    SYM LINK TEMP'
echo '###'
echo

ln -s app/ dist/;
ln -s package.json dist/package.json;
ln -s config.json dist/config.json;

echo
echo '###'
echo '    BROWSERIFY'
echo '###'
echo

node_modules/.bin/browserify dist/pages/home/ctrl.js -o dist/pages/home/bundle.js