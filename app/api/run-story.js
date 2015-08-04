'use strict';

import WebDriver from '../lib/web-driver';

function runStory (event) {
  try {
    console.log('ooooo');
    new WebDriver();
  }
  catch ( error ) {
    this.error(error);
  }
}

export default runStory;
