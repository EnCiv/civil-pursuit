'use strict';

import describe                   from 'redtea';
import superagent                 from 'superagent';
import should from 'should';
import Item                       from 'syn/../../dist/models/item';
import testWrapper from 'syn/../../dist/lib/app/test-wrapper';

function test(props) {
  const locals = {};

  return testWrapper(
    'Item page',

    { mongodb : true, http : true },

    wrappers => it => {
    it('should get a random item', () => new Promise((ok, ko) => {
      Item.findOneRandom().then(
        item => {
          if ( item ) {
            locals.item = item;
            ok();
          }
          else {
            Item.lambda().then(
              item => {
                locals.item = item;
                ok();
              },
              ko
            );
          }
        },
        ko
      );
    }));

    it('should get item page', () => new Promise((ok, ko) => {
      superagent
        .get(`http://localhost:${wrappers.http.app.get('port')}/item/${locals.item.id}/${locals.item.slug}`)
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
