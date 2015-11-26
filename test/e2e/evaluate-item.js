'use strict';

import EvaluateItem         from '../../app/lib/test/e2e/evaluate-item';
import CreateItem           from '../../app/lib/test/e2e/create-item';

describe ( 'Evaluate item' , function () {

  const props = {};

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  it ( 'should get driver' , function () {
    props.driver = global.driver;
    props.port = 13012;
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  describe ( 'Issue #1', function () {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ( 'should create issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe ( 'Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe ( 'Limit', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyLimit('1', props).then(done, done);

      });

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe ( 'Create problem' , function () {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it (
        'should create a problem',
        function (done) {
          this.timeout(5000);

          const _props = Object.assign(
            props,
            { join : false, train : false, parent : props.item, type : 'Problem' }
          );

          CreateItem.run(_props).then(
            results => {
              props.item = results.item;
              done();
            },
            done
          );
        }
      );

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  });

  describe ( 'Issue #2' , function () {

    it ( 'should create another issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      delete _props.item;

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    describe ('Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    describe ('Limit', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyLimit('1', props).then(done, done);

      });

    });
  });

  describe ( 'Issue #3' , function () {
    it ( 'should create another issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    describe ('Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    describe ('Limit', function () {

      it ( 'should be 2', function (done) {

        EvaluateItem.verifyLimit('2', props).then(done, done);

      });

    });
  });

  describe ( 'Issue #4' , function () {
    it ( 'should create another issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    it ( 'should wait 2 seconds', function (done) {

      this.timeout(3000);

      props.driver.client.pause(2000).then(() => done(), done);

    });

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    describe ('Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    describe ('Limit', function () {

      it ( 'should be 3', function (done) {

        EvaluateItem.verifyLimit('3', props).then(done, done);

      });

    });
  });

  describe ( 'Issue #5' , function () {
    it ( 'should create another issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    describe ('Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    describe ('Limit', function () {

      it ( 'should be 4', function (done) {

        EvaluateItem.verifyLimit('4', props).then(done, done);

      });

    });
  });

  describe ( 'Issue #6' , function () {
    it ( 'should create another issue', function (done) {
      this.timeout(1000 * 30);

      const _props = Object.assign(
        props,
        { join : false, train : false }
      );

      CreateItem.run(_props).then(
        results => {
          props.item = results.item;
          done();
        },
        done
      );
    } );

    it ( 'should have an evaluation cycle', function (done) {

      EvaluateItem.elementExists(props).then(done, done);

    });

    describe ('Cursor', function () {

      it ( 'should be 1', function (done) {

        EvaluateItem.verifyCursor('1', props).then(done, done);

      });

    });

    describe ('Limit', function () {

      it ( 'should be 5', function (done) {

        EvaluateItem.verifyLimit('5', props).then(done, done);

      });

    });
  });

});
