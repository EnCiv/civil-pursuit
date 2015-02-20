#!/usr/bin/env node

! function () {
  
  'use strict';

  function t(message) {
    console.log()
    console.log(message)
    console.log()
  }

  t('gulp build-prod');

  var cp = require('child_process');

  cp

    .spawn('gulp', ['build-prod'], { stdio: 'inherit' });

} ();
