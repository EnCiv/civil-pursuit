#!/bin/bash

# node app/models/migrations/v4.js  || exit 11;

cd assets &&
bower install &&
cd .. &&
echo "bower ok"
npm run transpile &&
echo "transpile ok"
npm run build &&
echo "build ok"
npm run less &&
echo "less ok"
npm run min-css &&
echo "min-css ok"
npm run uglify &&
echo "uglify ok"
npm run uglify-assets &&
echo "uglify-assets ok"
node dist/bin/migrate
echo "migrate ok"
