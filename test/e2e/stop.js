'use strict';

describe ( 'Stop' , function () {

  it ( 'should stop', function (done) {

    this.timeout(1000 * 5);

    global.driver.client.end(done);

  });

});
