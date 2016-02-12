'use strict';

import describe               from 'redtea';
import superagent             from 'superagent';
import should                 from 'should';
import testWrapper            from '../../../lib/app/test-wrapper';

function test(props) {
  const locals = {};

  return testWrapper(
    'Not found page',

    { mongodb : true, http : true },

    wrappers => it => {

      it('should not be found', () => new Promise((ok, ko) => {
        superagent
          .get(`http://localhost:${wrappers.http.app.get('port')}/1111111111111`)
          .end((error, res) => {
            try {
              res.status.should.be.exactly(404);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
      }));

    }
  );
}

export default test;
