'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Feedback       from 'syn/../../dist/models/feedback';
import isDocument     from './document';
import isObjectID     from './object-id';

function isFeedback (feedback, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(feedback, compare, serialized)));

    if ( ! serialized ) {
      it('should be a feedback', (ok, ko) => {
        feedback.should.be.an.instanceof(Feedback);
      });
    }

    it('should have a feedback', (ok, ko) => {
      feedback.should.have.property('feedback').which.is.a.String();
    });

    if ( 'feedback' in compare ) {
      it('feedback should match compare', (ok, ko) => {
        feedback.feedback.should.be.exactly(compare.feedback);
      });
    }

    it('User', [ it => {
      it('should have a user', (ok, ko) => {
        feedback.should.have.property('user');
      });

      it('user should be a object id', describe.use(() => isObjectID(feedback.user)));

      if ( 'user' in compare ) {
        it('user should match compare', (ok, ko) => {
          feedback.user.toString().should.be.exactly(compare.user._id ? compare.user._id.toString() : compare.user.toString());
        });
      }
    }]);

    it('Item', [ it => {
      it('should have a item', (ok, ko) => {
        feedback.should.have.property('item');
      });

      it('item should be a object id', describe.use(() => isObjectID(feedback.item)));

      if ( 'item' in compare ) {
        it('item should match compare', (ok, ko) => {
          feedback.item.toString().should.be.exactly(compare.item._id ? compare.item._id.toString() : compare.item.toString());
        });
      }
    }]);

  };

}

export default isFeedback;
