#!/bin/bash

# node app/models/migrations/v4.js  || exit 11;

cd assets &&
bower install &&
cd .. &&
npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
npm run migrate
