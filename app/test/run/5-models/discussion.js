'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isDiscussion         from 'syn/../../dist/test/assertions/is-discussion';
import Discussion           from 'syn/../../dist/models/discussion';
import isMungoError         from 'syn/../../dist/test/assertions/is-mungo-error';
import isError              from 'syn/../../dist/test/assertions/is-error';
import User                 from 'syn/../../dist/models/user';

function test () {
  const locals = {};

  return describe ( 'Discussion Model', it => {

    it('Find current', [ it => {
      it('should find nothing', () => new Promise((ok, ko) => {
        Discussion.findCurrent().then(
          discussion => {
            try {
              should(discussion).be.null();
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
      }))
    }]);

    it('Create', [it => {
      it('Missing subject', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          Discussion
            .create({})
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

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field subject')));
      }]);

      it('Missing description', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate = { subject : 'Hey! I am a discussion' };

          Discussion
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

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field description')));
      }]);

      it('Missing deadline', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate.description = 'It is important to have discussions';

          Discussion
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

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field deadline')));
      }]);

      it('Missing starts', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate.deadline = new Date(Date.now() + ( 1000 * 60 ));

          Discussion
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

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field starts')));
      }]);

      it('Missing goal', [it => {
        it('should query DB and throw an error', () => new Promise((ok, ko) => {
          locals.candidate.starts = new Date();

          Discussion
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

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field goal')));
      }]);

      it('Valid discussion', [ it=> {
        it('should create a valid discussion', () => new Promise((ok, ko) => {
          locals.candidate.goal = 1;

          Discussion
            .create(locals.candidate)
            .then(
              discussion => {
                locals.discussion = discussion;
                ok();
              },
              ko
            );
        }));

        it('should be a discussion', describe.use(() => isDiscussion(locals.discussion, locals.candidate)));
      }]);
    }]);

    it('Register users', [ it => {
      it('create 3 lambda users', () => new Promise((ok, ko)  => {
        Promise.all([
            User.lambda(),
            User.lambda(),
            User.lambda()
        ]).then(
          results => {
            locals.users = results;
            ok();
          },
          ko
        );
      }));

      it('Register user #1', [ it => {
        it('should register user #1', () => new Promise((ok, ko) => {
          locals.discussion.register(locals.users[0]).save().then(ok, ko);
        }));

        it('User #1 should be registered', () => new Promise((ok, ko) => {
          Discussion.findById(locals.discussion._id).then(
            discussion => {
              locals.discussion = discussion;
              discussion.registered
                .map(user => user.toString())
                .indexOf(locals.users[0]._id.toString())
                .should.be.above(-1);
              ok();
            },
            ko
          );
        }));
      }]);

      it('Register user #2 because goal of 1 user already reached', [ it => {
        it('should not register user #2 in document', () => new Promise((ok, ko) => {
          try {
            locals.discussion.register(locals.users[1]);
            throw new Error('Should have thrown error');
          }
          catch ( error ) {
            locals.error = error;
          }
          ok();
        }));

        it('should have thrown error', describe.use(() => isError(locals.error, null, 'Goal already achieved')));

        it('should not register user #2 in static model', () => new Promise((ok, ko) => {
          Discussion
            .updateById(locals.discussion, { $push : { registered : locals.users[1] }})
            .then(
              discussion => ko(new Error('Should have thrown error')),
              error => {
                locals.error = error;
                ok();
              }
            );
        }));

        it('should have thrown error', describe.use(() => isError(locals.error, null, 'Goal already achieved')));
      }]);

      it('Increment goal to 2', [ it => {
        it('should set goal to 2', () => new Promise((ok, ko) => {
          locals.discussion.set('goal', 2).save().then(ok, ko);
        }));

        it('should not register user #1 because he is already registered', [ it => {
          it('via document', () => new Promise((ok, ko) => {
            try {
              locals.discussion.register(locals.users[0]);
              throw new Error('Should have thrown error');
            }
            catch ( error ) {
              locals.error = error;
            }
            ok();
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'User already registered')));

          it('via model', () => new Promise((ok, ko) => {
            Discussion
              .updateById(locals.discussion, { $push : { registered : locals.users[0] }})
              .then(
                discussion => ko(new Error('Should have thrown error')),
                error => {
                  locals.error = error;
                  ok();
                }
              );
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'User already registered')));
        }]);

        it('should register user #2', () => new Promise((ok, ko) => {
          locals.discussion.register(locals.users[1]).save().then(ok, ko);
        }));

        it('User #2 should be registered', () => new Promise((ok, ko) => {
          Discussion.findById(locals.discussion).then(
            discussion => {
              try {
                locals.discussion = discussion;
                discussion.registered
                  .map(user => user.toString())
                  .indexOf(locals.users[1]._id.toString())
                  .should.be.above(-1);
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        }));
      }]);

      it('Close discussion', [ it => {
        it('should set goal to 3', () => new Promise((ok, ko) => {
          locals.discussion.set('goal', 3).save().then(ok, ko);
        }));

        it('should put deadline to now', () => new Promise((ok, ko) => {
          locals.discussion
            .set('deadline', new Date())
            .save()
            .then(ok, ko);
        }));

        it('should not register user #3 because deadline is past', [ it => {
          it('via document', () => new Promise((ok, ko) => {
            setTimeout(() => {
              try {
                locals.discussion.register(locals.users[2]);
                throw new Error('Should have thrown error');
              }
              catch ( error ) {
                locals.error = error;
              }
              ok();
            }, 1000);
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'Discussion is closed')));

          it('via model', () => new Promise((ok, ko) => {
            Discussion
              .updateById(locals.discussion, { $push : { registered : locals.users[2] }})
              .then(
                discussion => ko(new Error('Should have thrown error')),
                error => {
                  locals.error = error;
                  ok();
                }
              );
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'Discussion is closed')));
        }]);
      }]);

      it('Report discussion', [ it => {

        it('should put deadline to future', () => new Promise((ok, ko) => {
          locals.discussion
            .set('deadline', new Date(Date.now() + (1000 * 60 * 60)))
            .save()
            .then(ok, ko);
        }));

        it('should put start to future', () => new Promise((ok, ko) => {
          locals.discussion
            .set('starts', new Date(Date.now() + (1000 * 60 * 10)))
            .save()
            .then(ok, ko);
        }));

        it('should not register user #3 because discussion has not started yet', [ it => {
          it('via document', () => new Promise((ok, ko) => {
            setTimeout(() => {
              try {
                locals.discussion.register(locals.users[2]);
                throw new Error('Should have thrown error');
              }
              catch ( error ) {
                locals.error = error;
              }
              ok();
            }, 1000);
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'Discussion has not begun yet')));

          it('via model', () => new Promise((ok, ko) => {
            Discussion
              .updateById(locals.discussion, { $push : { registered : locals.users[2] }})
              .then(
                discussion => ko(new Error('Should have thrown error')),
                error => {
                  locals.error = error;
                  ok();
                }
              );
          }));

          it('should have thrown error', describe.use(() => isError(locals.error, null, 'Discussion has not begun yet')));
        }]);
      }]);
    }]);

    it('Find current', [ it => {
      it('should find nothing', () => new Promise((ok, ko) => {
        Discussion.findCurrent().then(
          discussion => {
            try {
              should(discussion).be.null();
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
      }));

      it('sets discussion to be current', () => new Promise((ok, ko) => {
        locals.discussion.set({
          starts : new Date(),
          deadline : new Date(Date.now() + (1000 * 5))
        }).save().then(ok, ko);
      }));

      it('should find something', () => new Promise((ok, ko) => {
        setTimeout(() => {
          Discussion.findCurrent().then(
            discussion => {
              locals.discussion = discussion;
              ok();
            },
            ko
          );
        }, 1000);
      }));

      it('should be a discussion', describe.use(() => isDiscussion(locals.discussion)));
    }]);

  });
}

export default test;
