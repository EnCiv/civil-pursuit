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
