'use strict';

import describe                   from 'redtea';
import superagent                 from 'superagent';
import Item                       from '../../models/item';

function test(props) {
  const locals = {};

  return describe ('Item page', it => {
    it('should get a random item', (ok, ko) => {
      Item.findOneRandom().then(
        item => {
          locals.item = item;
          ok();
        },
        ko
      );
    });
    it('should get item page', (ok, ko) => {
      superagent
        .get(`http://localhost:${props.port}/item/${locals.item.id}/${locals.item.slug}`)
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
    });
  });
}

export default test;
