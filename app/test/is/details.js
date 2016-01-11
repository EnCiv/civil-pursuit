'use strict';

import should                       from 'should';
import describe                     from 'redtea';
import isItem                       from './item';
import isFeedback                   from './feedback';
import isCriteria                   from './criteria';
import Criteria                     from 'syn/../../dist/models/criteria';

function isDetails (details, item = {}, serialized = false) {
  const locals = {};

  return it => {
    it('should be an object', () => details.should.be.an.Object());

    it('item', [it => {
      it('should have an item', () => details.should.have.property('item'));

      it('should be an item', describe.use(() => isItem(details.item)));

      if ( '_id' in item ) {
        it('should have the right item _id', () =>
          details.item._id.toString().should.be.exactly(item._id.toString())
        );
      }
    }]);

    it('criterias', [ it => {

      it('should get criterias', () => new Promise((ok, ko) => {
        Criteria.find().then(criterias => {
          locals.criterias = criterias;
          ok();
        }, ko)
      }));

      it('should have criterias', () => details.should.have.property('criterias'));

      it('should be an array', () => details.criterias.should.be.an.Array());

      it('should all be criterias', describe.use(() => (it) => {
        locals.criterias.forEach(criteria =>
          it('should be a criteria', describe.use(() => isCriteria(criteria)))
        );
      }));

    }]);

    it('votes', [ it => {

      it('should have votes', (ok, ko) => {
        details.should.have.property('votes');
      });

      it('should be an object', (ok, ko) => {
        details.votes.should.be.an.Object();
      });

      if ( Object.keys(details.votes).length ) {
        for ( let i = 0; i < 4; i ++ ) {
          it('should have criteria', (ok, ko) => {
            locals.criterias.forEach(criteria => {
              details.votes.should.have.property(criteria._id);
            });
          });

          it('should be criterias', (ok, ko) => {
            locals.criterias.forEach(criteria => {
              details.votes[criteria._id].should.be.an.Object();

              details.votes[criteria._id].should.have.property('total')
                .which.is.a.Number();

              details.votes[criteria._id].should.have.property('values')
                .which.is.an.Object();

              details.votes[criteria._id].values.should.have.property('+0')
                .which.is.a.Number();

              details.votes[criteria._id].values.should.have.property('+1')
                .which.is.a.Number();

              details.votes[criteria._id].values.should.have.property('-1')
                .which.is.a.Number();
            });
          });
        }
      }

    }]);

    it('feedback', [ it => {

      it('should have feedback', (ok, ko) => {
        details.should.have.property('feedback');
      });

      it('should be an array', (ok, ko) => {
        details.feedback.should.be.an.Array();
      });

    }]);

  };
}

export default isDetails;
