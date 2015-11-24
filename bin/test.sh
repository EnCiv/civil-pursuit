#!/bin/bash

mocha --compilers js:babel/register \
  test/replay/db.js \
  test/replay/lib-app.js \
  test/replay/user.js \
  test/replay/type.js \
  test/replay/item.js \
  test/replay/models/item \
  test/replay/http.js \
  test/replay/socket.js \
  test/e2e/start \
  test/e2e/training \
  test/e2e/join \
  test/e2e/training-in \
  test/e2e/evaluate-item \
  test/e2e/item-page \
  test/e2e/stop
