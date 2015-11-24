#!/usr/bin/bash

branch="$(git branch | grep \* | cut -d' ' -f2)"
issue="$(git branch | grep \* | cut -d' ' -f2 | cut -d/ -f1)";
message="'$1 #${issue}'";

echo Branch'     '$branch
echo Issue'      '$issue
echo Message'    '$message

echo

read -p "Is this OK? [Y/n] " prompt

if [ ! "$prompt" ] || [ "$prompt" = Y ] || [ "$prompt" = y ]; then
  npm run transpile || exit 6
  npm run build || exit 6
  npm run less || exit 6
  npm run min-css || exit 6
  npm run uglify || exit 6
  npm run uglify-assets || exit 6
  npm test || exit 6
  git add --ignore-removal \
    app/ \
    assets/ \
    test/ \
    fixtures/ \
    doc/ \
    bin/ \
    || exit 6
  git commit --allow-empty -am "'$1'" || exit 6
  git push bitbucket master || exit 6
  git push heroku master
else
  echo 'Bye!'
  exit 0;
fi
