'use strict';

import describe from 'redtea';
import superagent from 'superagent';

function test(props) {
  const locals = {};

  return describe ('Not found page', [
    {
      'should not be found' : () => new Promise((ok, ko) => {
        superagent
          .get(`http://localhost:${props.port}/1111111111111`)
          .end((error, res) => {
            try {
              res.status.should.be.exactly(404);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
      })
    }
  ]);
}

export default test;
