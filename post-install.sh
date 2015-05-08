#!/bin/bash

if [ -d "/app" ]; then
  # Heroku
  echo Heroku detected
  isHeroku=y
  symbolic_link="/app/node_modules/syn";
else
  symbolic_link="$PWD/node_modules/syn";
fi

if [ -L "$symbolic_link" ]; then
  echo 'Symbolic link already exists - skipping'
else
  echo
  echo '###'
  echo '    CREATE SYMBOLIC LINK '$symbolic_link
  echo '###'
  echo

  ln -s $PWD/app/ $symbolic_link  || exit 6;
  echo ln -s $PWD/app/ $symbolic_link  || exit 6;
fi

echo
echo '###'
echo '    MIGRATE TO v2'
echo '###'
echo

node app/models/migrations/v2.js  || exit 9;

echo
echo '###'
echo '    MIGRATE TO v3'
echo '###'
echo

node app/models/migrations/v3.js  || exit 10;

echo
echo '###'
echo '    MIGRATE TO v4'
echo '###'
echo

node app/models/migrations/v4.js  || exit 11;

echo
echo '###'
echo '    BOWER INSTALL'
echo '###'
echo

cd app/dist
../../node_modules/.bin/bower install  || exit 12;
cd ../..;

# if [ $isHeroku = 'y' ]; then

echo
echo '###'
echo '    REMOVE SYMBOLIC LINK' 
echo '###'
echo

unlink $symbolic_link  || exit 13;

echo
echo '###'
echo '    POST INSTALL FINSIH'
echo '###'
echo

# browserify ../../node_modules/socket.io-stream/index.js -s ss > dist/js/socket.io-stream.js