'use strict';

import Config                 from '../../app/models/config';
import Type                   from '../../app/models/type';
import verifyItemsPanel       from '../../app/lib/test/e2e/verify-items-panel';


describe ( 'NAVIGATION' , function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const props = {};

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  it ( 'should get driver' , function () {
    props.driver = global.driver;
    props.port = 13012;
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let topLevelTypeId, topLevelType;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  describe ( 'Get top level type' , function () {

    it ( 'should go home' , function (done) {

      props.driver.client.url('http://localhost:13012').then(
        () => done(), done
      );

    });

    it ( 'should get top level type _id from config' , function (done) {

      Config.get('top level type').then(
        config => {
          topLevelTypeId = config;
          done();
        },
        done
      );

    });

    it ( 'should get type using config _id' , function (done) {

      Type.findById(topLevelTypeId).then(
        type => {
          topLevelType = type;
          done();
        },
        done
      );

    });

    describe ( 'top level panel' , function () {

      const _props = Object.assign(props, {
        options : {
          panel : '#top-level-panel > .syn-panel',
          title : 'Issue'
        }
      });

      it ( 'should exist' , function (done) {

        verifyItemsPanel.verifyPanelIsHere(_props).then(() => done(), done);

      });

      it ( 'should have the right title' , function (done) {

        verifyItemsPanel.verifyTitle(_props).then(() => done(), done);

      });

    });

  });

});
