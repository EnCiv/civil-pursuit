'use strict';

import describe                     from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getItemDetails             from '../../api/get-item-details';
import isDetails                  from '../.test/assertions/is-details';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import Vote                       from '../../models/vote';
import Criteria                   from '../../models/criteria';


function test (props) {
  const locals = {};

  return describe('API / Get Item Details', it => {

    it('should get criterias', () => new Promise((ok, ko) => {
      try {
        Criteria.find().then(
          criterias => {
            locals.criterias = criterias;
            ok();
          },
          ko
        );
      }
      catch ( error ) {
        ko(error);
      }
    }));

    it('should create item', () => new Promise((ok, ko) => {
      Item.lambda().then(
        item => {
          locals.item = item;
          ok();
        },
        ko
      );
    }));

    it('should get item details from model', () => new Promise((ok, ko) => {
      Item.getDetails(locals.item).then(
        details => {
          locals.modelDetails = details;
          ok();
        },
        ko
      );
    }));

    it('should get item details from API', () => new Promise((ok, ko) => {
      mock(props.socket, getItemDetails, 'get item details', locals.item)
        .then(
          details => {
            locals.details = details;
            ok();
          },
          ko
        );
    }));

    it('should be details', describe.use(() => isDetails(locals.details)));
    //
    // it('Votes', [ it => {
    //
    //   it('should have no votes', (ok, ko) => {
    //     Object.keys(locals.details.votes).should.have.length(0);
    //     ok();
    //   });
    //
    //   it('Add a new vote', [ it => {
    //
    //     it('should vote [-1, 0, 0, 1] in DB', (ok, ko) => {
    //       Promise.all([
    //
    //         Vote.create({
    //           item        :   locals.item,
    //           user        :   locals.item.user,
    //           criteria    :   locals.criterias[0],
    //           value       :   -1
    //         }),
    //
    //         Vote.create({
    //           item        :   locals.item,
    //           user        :   locals.item.user,
    //           criteria    :   locals.criterias[1],
    //           value       :   0
    //         }),
    //
    //         Vote.create({
    //           item        :   locals.item,
    //           user        :   locals.item.user,
    //           criteria    :   locals.criterias[2],
    //           value       :   0
    //         }),
    //
    //         Vote.create({
    //           item        :   locals.item,
    //           user        :   locals.item.user,
    //           criteria    :   locals.criterias[3],
    //           value       :   1
    //         })
    //
    //       ]).then(ok, ko);
    //     });
    //
    //     it('should get item details from API', (ok, ko) => {
    //       mock(props.socket, getItemDetails, 'get item details', locals.item)
    //         .then(
    //           details => {
    //             locals.details = details;
    //             ok();
    //           },
    //           ko
    //         );
    //     });
    //
    //     it('should be details', describe.use(() => isDetails(locals.details, locals.item)));
    //
    //     it('should have votes', (ok, ko) => {
    //       Object.keys(locals.details.votes).should.have.length(4);
    //       ok();
    //     });
    //
    //   }]);
    //
    // }]);

  });
}

export default test;
