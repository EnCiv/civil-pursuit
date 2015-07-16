#!/usr/bin/bash

uglifyjs assets/js/autogrow.js -o assets/js/autogrow.min.js;

uglifyjs assets/js/socket.io-stream.js -o assets/js/socket.io-stream.min.js;

cat \
  assets/js/autogrow.min.js \
  assets/assets/vex-2.2.1/js/vex.combined.min.js \
  assets/js/socket.io-stream.min.js \
  assets/bower_components/goalProgress/goalProgress.min.js \
  assets/bower_components/d3/d3.min.js \
  assets/bower_components/c3/c3.min.js > assets/js/assets.min.js;