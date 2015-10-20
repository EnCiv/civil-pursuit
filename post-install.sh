#!/bin/bash

# node app/models/migrations/v4.js  || exit 11;

cd assets
../node_modules/.bin/bower install  || exit 12;
cd ..;

npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
npm run migrate
