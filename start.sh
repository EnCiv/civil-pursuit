#!/bin/bash

~/dude-js/dependencies/mongodb/mongodb-linux-x86_64-2.6.1/bin/mongod --port 4567 --dbpath ~/dude-js/data/syndb &

export MONGOHQ_URL=mongodb://localhost:4567/syndb
export PORT=3012
export SYNAPP_ENV=alpha-heroku
