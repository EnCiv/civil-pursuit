'use strict';

import describe                   from 'redtea';
import superagent                 from 'superagent';
import Type                       from 'syn/../../dist/models/type';

function test(props) {
  const locals = {};

  return describe ('Panel page', it => {
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
      console.log(`http://localhost:${props.port}/items/${locals.type.id}`);
      superagent
        .get(`http://localhost:${props.port}/items/${locals.type.id}`)
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
  });
}

export default test;
