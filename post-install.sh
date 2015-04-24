#!/bin/bash

symbolic_link="$PWD/node_modules/syn";

echo
echo '###'
echo '    CREATE SYMBOLIC LINK'
echo '###'
echo

echo $symbolic_link

echo
echo '###'
echo '    SYMBOLIC LINK EXISTS?'
echo '###'
echo

ls $symbolic_link

echo
echo '###'
echo '    REMOVE SYMBOLIC LINK'
echo '###'
echo

unlink $symbolic_link

echo
echo '###'
echo '    LIST SYMBOLIC LINK'
echo '###'
echo

ls $symbolic_link

echo
echo '###'
echo '    CREATE SYMBOLIC LINK'
echo '###'
echo

ln -s $PWD/app/ $symbolic_link;

echo
echo '###'
echo '    CREATE SYMBOLIC PACKAGE.JSON'
echo '###'
echo

ln -s $PWD/package.json $symbolic_link/package.json;

echo
echo '###'
echo '    LIST SYMBOLIC LINK'
echo '###'
echo

ls $symbolic_link

echo
echo '###'
echo '    MIGRATE TO v2'
echo '###'
echo

node app/models/migrations/v2.js;

echo
echo '###'
echo '    MIGRATE TO v3'
echo '###'
echo

node app/models/migrations/v3.js;

echo
echo '###'
echo '    BOWER INSTALL'
echo '###'
echo

cd app/dist && ../../node_modules/.bin/bower install && cd ../..;

echo
echo '###'
echo '    POST INSTALL FINSIH'
echo '###'
echo

# browserify ../../node_modules/socket.io-stream/index.js -s ss > dist/js/socket.io-stream.js