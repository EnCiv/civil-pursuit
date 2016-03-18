#!/usr/bin/bash

if [ ! "$1" ]; then
  echo "Missing commit message";
  exit 1;
fi

branch="$(git branch | grep \* | cut -d' ' -f2)"
issue="$(git branch | grep \* | cut -d' ' -f2 | cut -d/ -f1)";
message="$1 #${issue}";

echo Branch'     '$branch
echo Issue'      '$issue
echo Message'    '$message

sleep 3

rm -rf dist/
npm run transpile &&
npm run build &&
npm run less &&
npm run min-css &&
npm run uglify &&
npm run uglify-assets &&
npm test &&
git add --ignore-removal app/ assets/ fixtures/ doc/ &&
git commit --allow-empty -am "$message" &&
git pull github $branch;
git push github $branch &&
git push heroku $branch:master
