'use strict';

import Join from '../../app/lib/test/e2e/join';

describe ( 'Join' , function () {

  const props = {};

  it ( 'should get driver' , function () {
    props.driver = global.driver;
  });

  it ( 'should click join button', function (done) {

    Join.clickJoinButton(props).then(done, done);

  });

  it ( 'should wait 1.5 secondes', function (done) {

    this.timeout(1000 * 3);

    Join.pause(1.5, props).then(done, done);

  });

  it ( 'should fill email', function (done) {

    this.timeout(1000 * 7);

    Join.fillEmail(props).then(done, done);

  });

  it ( 'should fill password', function (done) {

    Join.fillPassword(props).then(done, done);

  });

  it ( 'should fill confirm', function (done) {

    Join.fillConfirm(props).then(done, done);

  });

  it ( 'should fill agree to terms', function (done) {

    Join.agreeToTerms(props).then(done, done);

  });

  it ( 'should submit form', function (done) {

    Join.submit(props).then(done, done);

  });

  it ( 'should wait 2 secondes', function (done) {

    this.timeout(1000 * 3);

    Join.pause(2, props).then(done, done);

  });

  it ( 'should have moved to profile page', function (done) {

    Join.movedToProfile(props).then(done, done);

  });

  it ( 'should have cookie', function (done) {

    Join.hasCookie(props).then(done, done);

  });

});
