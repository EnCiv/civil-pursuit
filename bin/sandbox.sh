#!/bin/bash

export MONGODB_URI=mongodb://localhost:4567/syndb_sandbox_$RANDOM$$;
export PORT=4012
export SYNAPP_ENV=alpha-heroku

npm run migrate && npm start
