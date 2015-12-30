'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import User                 from 'syn/../../dist/models/user';
import Item                 from 'syn/../../dist/models/item';
import Type                 from 'syn/../../dist/models/type';
import Feedback             from 'syn/../../dist/models/feedback';
import Vote                 from 'syn/../../dist/models/vote';
import Criteria             from 'syn/../../dist/models/criteria';
import isMungoError         from 'syn/../../dist/test/assertions/is-mungo-error';
import isItem               from 'syn/../../dist/test/assertions/is-item';
import isEvaluation         from 'syn/../../dist/test/assertions/is-evaluation';
import isDetails            from 'syn/../../dist/test/assertions/is-details';

function test () {
  const locals = {
    candidate : {}
  };

  return describe ( 'Item Model', it => {
    it('Test assertion', [ it => {
      it('should get random item', () => new Promise((ok, ko) => {
        Item.findOneRandom().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('should be a item', describe.use(() => isItem(locals.item)));
    }]);

    it('Create', [ it => {
      it('Missing subject', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Item
            .create(locals.candidate)
            .then(
              item => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field subject')));
      }]);

      it('Missing description', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate.subject = 'Item model - test create';

          Item
            .create(locals.candidate)
            .then(
              item => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field description')));
      }]);

      it('Missing type', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate.description = 'Item model - test create - description';

          Item
            .create(locals.candidate)
            .then(
              item => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field type')));
      }]);

      it('Missing user', [it => {
        it('should get create type', () => new Promise((ok, ko) => {
          Type.create({ name : 'Item Model - test type - create'}).then(
            type => {
              locals.candidate.type = type;
              ok();
            },
            ko
          );
        }));

        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Item
            .create(locals.candidate)
            .then(
              item => {
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

      it('Valid item', [it => {
        it('should get create user', () => new Promise((ok, ko) => {
          Type.create({ name : 'Item Model - test user - create'}).then(
            user => {
              locals.candidate.user = user;
              ok();
            },
            ko
          );
        }));

        it('should create item', () => new Promise((ok, ko) => {
          Item
            .create(locals.candidate)
            .then(
              item => {
                locals.item = item;
                ok();
              },
              ko
            );
        }));

        it('should be an item', describe.use(() => isItem(locals.item)));
      }]);

    }]);

    it('Item evaluate', [ it => {
      it('Create random item', () => new Promise((ok, ko) => {
        Item.lambda().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('should evaluate', () => new Promise((ok, ko) => {
        Item.evaluate(locals.item.user, locals.item).then(
          evaluation => {
            locals.evaluation = evaluation;
            ok();
          },
          ko
        );
      }));

      it('should be an evaluation', describe.use(() => isEvaluation(locals.evaluation, locals.item.user, locals.item, locals.item.type)));
    }]);

    it('should get details', [ it => {
      it('Create random item', () => new Promise((ok, ko) => {
        Item.lambda().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('should create feedback', () => new Promise((ok, ko) => {
        Feedback.lambda({ item : locals.item }).then(
          feedback => {
            locals.feedback = feedback;
            ok();
          },
          ko
        );
      }));

      it('should fetch criterias', () => new Promise((ok, ko) => {
        Criteria.find().then(
          criterias => {
            locals.criterias = criterias;
            ok();
          },
          ko
        );
      }));

      it('should create vote', () => new Promise((ok, ko) => {
        Promise.all(
          locals.criterias.map(criteria => Vote.lambda({ item : locals.item, criteria }))
        ).then(votes => {
          locals.votes = votes;
          ok();
        }, ko)
      }));

      it('should get item details', () => new Promise((ok, ko) => {
        Item.getDetails(locals.item).then(
          details => {
            locals.details = details;
            ok();
          },
          ko
        );
      }));

      it('should be item details', describe.use(() => isDetails(locals.details, locals.item)));

      it('should have 1 feedback', () => locals.details.feedback.should.have.length(1));

      it('should have the right feedback', () => locals.details.feedback[0]._id.equals(locals.feedback._id).should.be.true());

      it('should have the right votes', () => {
        locals.criterias.forEach(criteria => {
          locals.details.votes[criteria._id].total.should.be.exactly(1);

          const vote = locals.votes.reduce((match, vote) => {
            if ( vote.criteria.equals(criteria._id) ) {
              match = vote;
            }
            return match;
          }, null);

          if ( ! vote ) {
            throw new Error('Can not find vote for criteria ' + criteria._id);
          }

          locals.details.votes[criteria._id].values['-1'].should.be.exactly(+(vote.value === -1));

          locals.details.votes[criteria._id].values['+0'].should.be.exactly(+(vote.value === 0));

          locals.details.votes[criteria._id].values['+1'].should.be.exactly(+(vote.value === 1));
        });
      });
    }]);

  });
}

export default test;
