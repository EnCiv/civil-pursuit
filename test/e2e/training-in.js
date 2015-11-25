'use strict';

import Training from '../../app/lib/test/e2e/training';

describe ( 'Training' , function () {

  const props = {};

  it ( 'should get driver' , function () {
    props.driver = global.driver;
  });

  it ( 'should go home', function (done) {
    this.timeout(3000);
    props.driver.client.url('http://localhost:13012').then(
      () => done(), done
    );
  });

  it ( 'should get training from DB', function (done) {

    Training.iGetTraining(props).then(done, done);

  });

  it ( 'should find out if user is signed in', function (done) {

    Training.findOutIfUserIsSignedIn(props).then(done, done);

  });

  it ( 'should reduce instructions', function (done) {

    Training.reduceInstructions(props).then(done, done);

  });

  it ( 'should see training', function (done) {

    Training.iSeeTraining(props).then(done, done);

  });

  it ( 'should have all the instructions', function (done) {

    this.timeout(1000 * 30);

    Training.allInstructionsAreCorrect(props).then(() => done(), done);

  });

  it ( 'should check do not show next time', function (done) {

    this.timeout(1000 * 30);

    Training.doNotShowNextTime(props).then(() => done(), done);

  });

});
