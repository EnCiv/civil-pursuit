#!/usr/bin/bash

if [ ! "$1" ]; then
  echo "Missing remote name";
  exit 1;
fi

heroku config:set TURK_ENV=$TURK_ENV NODE_ENV=$NODE_ENV GoogleCivicApiKey=$GoogleCivicApiKey AWSSecretAccessKey=$AWSSecretAccessKey AWSAccessKeyId=$AWSAccessKeyId SYNAPP_ENV=$SYNAPP_ENV --remote $1
