#!/bin/bash

echo
echo '###'
echo '    MIGRATE TO v2'
echo '###'
echo

node app/models/migrations/v2.js  || exit 1;

echo
echo '###'
echo '    MIGRATE TO v3'
echo '###'
echo

node app/models/migrations/v3.js  || exit 1;

echo
echo '###'
echo '    BOWER INSTALL'
echo '###'
echo

cd app/dist
../../node_modules/.bin/bower install  || exit 1;
cd ../..;

echo
echo '###'
echo '    POST INSTALL FINSIH'
echo '###'
echo

# browserify ../../node_modules/socket.io-stream/index.js -s ss > dist/js/socket.io-stream.js