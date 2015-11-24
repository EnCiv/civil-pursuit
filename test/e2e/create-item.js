'use strict';

import CreateItem from '../../app/lib/test/e2e/create-item';

describe ( 'Create item' , function () {

  const props = {};

  it ( 'should get driver' , function () {
    props.driver = global.driver;
    props.port = 13012;
  });

  it ( 'should create item', function (done) {

    this.timeout(1000 * 10);

    CreateItem.run(props).then(() => done(), done);

  });

  // it ( 'should click toggle', function (done) {
  //
  //   CreateItem.clickToggle(props).then(() => done(), done);
  //
  // });
  //
  // it ( 'should set subject', function (done) {
  //
  //   CreateItem.setSubject(props).then(() => done(), done);
  //
  // });

});
