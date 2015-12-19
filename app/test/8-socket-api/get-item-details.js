'use strict';

import describe                     from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getItemDetails             from '../../api/get-item-details';
import isDetails                  from '../.test/assertions/is-details';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import Vote                       from '../../models/vote';
import Feedback                   from '../../models/feedback';
import Criteria                   from '../../models/criteria';


function test (props) {
  const locals = {
    votes : [-1 , 1, 0, -1]
  };

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

    it('Votes', [ it => {

      it('should have no votes', () => Object.keys(locals.details.votes).should.have.length(0));

      it('Add a new vote', [ it => {

        it('should vote [-1, 0, 0, 1] in DB', () => new Promise((ok, ko) => {
          Promise.all([

            Vote.create({
              item        :   locals.item,
              user        :   locals.item.user,
              criteria    :   locals.criterias[0],
              value       :   locals.votes[0]
            }),

            Vote.create({
              item        :   locals.item,
              user        :   locals.item.user,
              criteria    :   locals.criterias[1],
              value       :   locals.votes[1]
            }),

            Vote.create({
              item        :   locals.item,
              user        :   locals.item.user,
              criteria    :   locals.criterias[2],
              value       :   locals.votes[2]
            }),

            Vote.create({
              item        :   locals.item,
              user        :   locals.item.user,
              criteria    :   locals.criterias[3],
              value       :   locals.votes[3]
            })

          ]).then(ok, ko);
        }));

        it('should get item details from API', () => new Promise((ok, ko) => {
          mock(props.socket, getItemDetails, 'get item details', locals.item)
            .then(
              details => {
                locals.details = details;
                console.log(require('util').inspect(details, { depth: null }));
                ok();
              },
              ko
            );
        }));


        it('should be details', describe.use(() => isDetails(locals.details, locals.item)));

        it('should have votes', () => Object.keys(locals.details.votes).should.have.length(4));

        it('Vote by vote', [ it => {
          it('Criteria #1', [it => {

            it('should have votes for criteria', () => locals.details.votes.should.have.property(locals.criterias[0]._id));

            it('should be an object', () =>
              locals.details.votes[locals.criterias[0]._id]
                .should.be.an.Object());

            it('should have a total of 1', () =>
              locals.details.votes[locals.criterias[0]._id]
                .should.have.property('total')
                .which.is.exactly(1));

            it('should have values', () =>
              locals.details.votes[locals.criterias[0]._id]
                .should.have.property('values'));

            it('should be an object', () =>
              locals.details.votes[locals.criterias[0]._id].values
                .should.be.an.Object());

            it('should have the right -1 value', [it => {

              it('should be a -1', () => locals.details.votes[locals.criterias[0]._id].values
                .should.have.property('-1'));

                it('should be the right votes', () => locals.details.votes[locals.criterias[0]._id].values['-1']
                  .should.be.exactly(+(locals.votes[0] === -1)));

            }]);

            it('should have the right +1 value', [it => {

              it('should be a +1', () => locals.details.votes[locals.criterias[0]._id].values
                .should.have.property('+1'));

                it('should be the right votes', () => locals.details.votes[locals.criterias[0]._id].values['+1']
                  .should.be.exactly(+(locals.votes[0] === +1)));

            }]);

            it('should have the right +0 value', [it => {

              it('should be a 0', () => locals.details.votes[locals.criterias[0]._id].values
                .should.have.property('+0'));

                it('should be the right votes', () => locals.details.votes[locals.criterias[0]._id].values['+0']
                  .should.be.exactly(+(locals.votes[0] === +0)));

            }]);

          }]);
        }]);

      }]);

    }]);

    it('Feedback', [ it => {

      it('should add feedback', () => new Promise((ok, ko) => {
        Feedback.lambda({ item : locals.item }).then(
          feedback => {
            locals.feedback = feedback;
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

      it('should have 1 feedback' , () => locals.details.feedback.should.have.length(1));

      it('should be the same feedback', () => locals.details.feedback[0]._id.equals(locals.feedback._id).should.be.true());

    }]);

  });
}

export default test;
