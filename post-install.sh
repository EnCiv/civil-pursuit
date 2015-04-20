#!/bin/bash

symbolic_link="$PWD/node_modules/syn";

if [ ! -d "$symbolic_link" ]; then
  ln -s $PWD/app/ $symbolic_link;
fi

if [ ! -f "$symbolic_link/package.json" ]; then
  ln -s $PWD/package.json $symbolic_link/package.json;
fi

node app/models/migrations/v2.js;

node app/models/migrations/v3.js;

cd app/dist && ../../node_modules/.bin/bower install && cd ../..;

# browserify ../../node_modules/socket.io-stream/index.js -s ss > dist/js/socket.io-stream.js