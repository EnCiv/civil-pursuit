'use strict';

function test (props) {
  return [
    {
      'should be an object' : (ok, ko) => {
        props.should.be.an.Object();
        ok();
      }
    }
  ];
}

export default test;
