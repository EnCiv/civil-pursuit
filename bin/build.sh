#!/usr/bin/bash

npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
git add --ignore-removal app/ dist/ assets/ &&
git commit -am "'$1'" &&
git push bitbucket master &&
git push heroku master
