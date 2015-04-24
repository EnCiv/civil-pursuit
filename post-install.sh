#!/bin/bash

symbolic_link="$PWD/node_modules/syn";

echo '###'
echo '    CREATE SYMBOLIC LINK'
echo '###'

echo $symbolic_link

echo '###'
echo '    SYMBOLIC LINK EXISTS?'
echo '###'

ls $symbolic_link

echo '###'
echo '    REMOVE SYMBOLIC LINK'
echo '###'

unlink $symbolic_link

echo '###'
echo '    LIST SYMBOLIC LINK'
echo '###'

ls $symbolic_link

echo '###'
echo '    CREATE SYMBOLIC LINK'
echo '###'

ln -s $PWD/app/ $symbolic_link;

echo '###'
echo '    CREATE SYMBOLIC PACKAGE.JSON'
echo '###'

ln -s $PWD/package.json $symbolic_link/package.json;

echo '###'
echo '    LIST SYMBOLIC LINK'
echo '###'

ls $symbolic_link

node app/models/migrations/v2.js;

node app/models/migrations/v3.js;

cd app/dist && ../../node_modules/.bin/bower install && cd ../..;

# browserify ../../node_modules/socket.io-stream/index.js -s ss > dist/js/socket.io-stream.js