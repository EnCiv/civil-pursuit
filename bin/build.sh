#!/usr/bin/bash

. .sync.sh &&
npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
npm test &&
git add --ignore-removal app/ dist/ assets/ test/replay &&
git commit -am "'$1'" &&
git push bitbucket master &&
git push heroku master
