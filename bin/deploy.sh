#!/usr/bin/bash

bash bin/build.sh &&
npm test &&
git push heroku master