'use strict';

import describe                   from 'redtea';
import superagent                 from 'superagent';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import Type                       from 'syn/../../dist/models/type';

function test(props) {
  const locals = {};

  return testWrapper(
    'Panel page',

    { mongodb : true, http : true },

    wrappers => it => {
      it('should create a type', () => new Promise((ok, ko) => {
        Type.create({ name : 'Test HTTP Panel page' }).then(
          type => {
            locals.type = type;
            ok();
          },
          ko
        );
      }));

      it('should get panel page', () => new Promise((ok, ko) => {
        superagent
          .get(`http://localhost:${wrappers.http.app.get('port')}/items/${locals.type.id}`)
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
