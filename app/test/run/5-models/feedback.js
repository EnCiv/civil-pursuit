'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import Feedback             from 'syn/../../dist/models/feedback';
import Item                 from 'syn/../../dist/models/item';
import User                 from 'syn/../../dist/models/user';
import isFeedback           from 'syn/../../dist/test/assertions/is-feedback';
import isMungoError         from 'syn/../../dist/test/assertions/is-mungo-error';

function test () {
  const locals = {
    candidate : {}
  };

  return describe('Feedback Model', it => {
    it('Create with errors', [ it => {
      it('Empty', [ it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field item')));
      }]);

      it('Missing user', [ it => {
        it('should get item', () => new Promise((ok, ko) => {
          Item.lambda().then(
            item => {
              locals.candidate.item = item;
              ok();
            },
            ko
          );
        }));

        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field user')));
      }]);

      it('Missing feedback', [ it => {
        it('should get user', () => new Promise((ok, ko) => {
          User.lambda().then(
            user => {
              locals.candidate.user = user;
              ok();
            },
            ko
          );
        }));

        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field feedback')));
      }]);
    }]);

    it('Create valid feedback', [ it => {
      it('should insert feedback', () => new Promise((ok, ko) => {
        locals.candidate.feedback = 'Hey! I am a positive feedback!';

        Feedback
          .create(locals.candidate)
          .then(
            feedback => {
              locals.feedback = feedback;
              ok();
            },
            ko
          );
      }));

      it('should be a feedback', describe.use(() => isFeedback(locals.feedback, locals.candidate)));
    }]);
  });

}

export default test;
