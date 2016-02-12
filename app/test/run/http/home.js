'use strict';

import describe               from 'redtea';
import superagent             from 'superagent';
import should                 from 'should';
import testWrapper            from '../../../lib/app/test-wrapper';

function test(props) {
  const locals = {};

  return testWrapper(
    'Home page',

    { mongodb : true, http : true },

    wrappers => it => {

      it('should get home page', () => new Promise((ok, ko) => {
        superagent
          .get(`http://localhost:${wrappers.http.app.get('port')}/`)
          .end((error, res) => {
            try {
              if ( error ) {
                throw error;
              }
              res.status.should.be.exactly(200);
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
