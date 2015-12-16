'use strict';

import should               from 'should';
import describe             from 'redtea';
import makePanelId          from '../../lib/app/make-panel-id';
import Type                 from '../../models/type';
import Item                 from '../../models/item';
import isError              from '../.test/assertions/is-error';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Make Panel ID', it => {
    it('should be a function', (ok, ko) => {
      makePanelId.should.be.a.Function();
      ok();
    });

    it('call with no arguments', [ it => {

      it('should throw', (ok, ko) => {
        try {
          makePanelId();
          throw new Error('Should have thrown error');
        }
        catch ( error ) {
          locals.error = error;
          ok();
        }
      });

      it('should complain about missing panel type', describe.use(() => isError(locals.error, null, 'Missing type - can not make panel id')));

      it('Type', [ it => {
        it('should create a type', (ok, ko) => {
          Type.create({ name : 'type for make panel id' }).then(
            type => {
              locals.type = type;
              ok();
            },
            ko
          );
        });
      }]);

      it('Panel id with type being a Type', [ it => {
        it('should make panel id', (ok, ko) => {
          locals.panelId = makePanelId({ type : locals.type });
          ok();
        });

        it('should be a string', (ok, ko) => {
          locals.panelId.should.be.a.String();
          ok();
        });

        it('should be the type id', (ok, ko) => {
          locals.panelId.should.be.exactly(`${locals.type._id}`);
          ok();
        });
      }]);

      it('Panel id with type being an object id', [ it => {
        it('should make panel id', (ok, ko) => {
          locals.panelId = makePanelId({ type : locals.type._id });
          ok();
        });

        it('should be a string', (ok, ko) => {
          locals.panelId.should.be.a.String();
          ok();
        });

        it('should be the type id', (ok, ko) => {
          locals.panelId.should.be.exactly(`${locals.type._id}`);
          ok();
        });
      }]);

      it('parent', [ it => {
        it('should create parent item', (ok, ko) => {
          Item.lambda({ type : locals.type }).then(
            item => {
              locals.item = item;
              ok();
            },
            ko
          );
        });

        it('should create a subtype', (ok, ko) => {
          Type.create({ name : 'subtype for make panel id' }).then(
            subtype => {
              locals.subtype = subtype;
              ok();
            },
            ko
          );
        });

        it('Panel id with parent', [ it => {
          it('should make panel id', (ok, ko) => {
            locals.panelId = makePanelId({ type : locals.subtype, parent : locals.item });
            ok();
          });

          it('should be a string', (ok, ko) => {
            locals.panelId.should.be.a.String();
            ok();
          });

          it('should be the type id + the parent id', (ok, ko) => {
            locals.panelId.should.be.exactly(`${locals.subtype._id}-${locals.item._id}`);
            ok();
          });
        }]);
      }]);

    }]);
  });

}

export default test;
