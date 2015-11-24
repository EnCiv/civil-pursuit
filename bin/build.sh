#!/usr/bin/bash

npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
npm test &&
git add --ignore-removal app/ assets/ test/replay fixtures/ doc/ &&
git commit --allow-empty -am "'$1'" &&
git push bitbucket master &&
git push heroku master
