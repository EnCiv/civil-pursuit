'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isItem               from '../.test/assertions/is-item';
import User                 from '../../models/user';
import Item                 from '../../models/item';
import Type                 from '../../models/type';
import isMungoError         from '../.test/assertions/is-mungo-error';

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

  });
}

export default test;
