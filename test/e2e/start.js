'use strict';

import WebDriver from '../../app/lib/app/webdriver';
import reset from '../../app/bin/reset';

describe ( 'Start Firefox driver' , function () {

  it ( 'should reset db', function (done) {

    this.timeout(1000 * 15);

    reset().then(() => done(), done);

  });

  it ( 'should start driver', function (done) {

    this.timeout(1000 * 10);

    global.driver = new WebDriver();

    global.driver.on('ready', () => done());

  });

  it ( 'should go home' , function (done) {

    this.timeout(1000 * 60);

    global.driver.client.url('http://localhost:13012').then(
      () => done(),
      done
    );

  });

});
