'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import config               from 'syn/../../dist/../public.json';
import describe             from 'redtea';
import makePanel            from 'syn/../../dist/lib/app/make-panel';
import Type                 from 'syn/../../dist/models/type';
import Item                 from 'syn/../../dist/models/item';
import isType               from 'syn/../../dist/test/assertions/is-type';

const { Describer } = describe;

function test () {

  const locals = {};

  return describe ( 'Lib / App / Make Panel' , it => {

    it('should be a function', () => makePanel.should.be.a.Function());

    it('should throw an error if no type passed', [ it => {
      it('as an object', () => {
        try {
          makePanel({});
          throw new Error('Should have thrown');
        }
        catch ( error ) {
          error.message.should.be.exactly('Could not determine panel type');
        }
      });
    }]);

    it('As an object', [ it => {

      it('Type only', [ it => {

        it('should create a type', () => new Promise((ok, ko) => {
          Type.create({ name : 'test make panel - parent'}).then(
            type => {
              locals.type = type;
              ok();
            },
            ko
          );
        }));

        it('should make panel', (ok, ko) => {
          locals.panel = makePanel({ type : locals.type });
          locals.panel.should.be.an.Object();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('panel', it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
          });

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
          });

          it('should type be a type',

            it => isType(locals.panel.panel.type, locals.type)(it)

          );

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
          });

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
        });

      }]);

      it('With parent', [ it => {

        it('should create a subtype', () => new Promise((ok, ko) => {
          Type.create({ name : 'test make panel - subtype', parent : locals.type }).then(
            type => {
              locals.subtype = type;
              ok();
            },
            ko
          );
        }));

        it('should create a parent item', () => new Promise((ok, ko) => {
          Item.lambda({ type : locals.type }).then(
            item => {
              locals.parentItem = item;
              ok();
            },
            ko
          );
        }));

        it('should make panel', (ok, ko) => {
          locals.panel = makePanel({ type : locals.subtype, parent : locals.parentItem });
          locals.panel.should.be.an.Object();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
          });


          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
            locals.panel.panel.type._id.equals(locals.subtype._id).should.be.true();
          });


          it('should have the same parent', (ok, ko) => {
            locals.panel.panel.should.have.property('parent');
            locals.panel.panel.parent._id.equals(locals.parentItem._id).should.be.true();
          });


          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
          });


          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
        });

      }]);
    }]);

    it('As a string', [ it => {

      it('Type only', [ it => {

        it('should make panel', () => new Promise((ok, ko) => {
          locals.panel = makePanel(locals.type._id.toString());
          locals.panel.should.be.an.Object();
          ok();
        }));

        it('panel', [ it => {

          it('should be a panel', () => new Promise((ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
            ok();
          }));

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type').which.is.an.Object();
            locals.panel.panel.type.should.have.property('_id')
              .which.is.exactly(locals.type._id.toString());
          });

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
        });

      }]);

      it('With parent', [ it => {

        it('should make panel', (ok, ko) => {
          locals.type = Mungo.ObjectID();
          locals.parent = Mungo.ObjectID();
          locals.panel = makePanel({ type : locals.type, parent : locals.parent });
          locals.panel.should.be.an.Object();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
          });

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
            locals.panel.panel.type.equals(locals.type).should.be.true();
          });

          it('should have the same parent', (ok, ko) => {
            locals.panel.panel.should.have.property('parent');
            locals.panel.panel.parent.equals(locals.parent).should.be.true();
          });

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
        });

      }]);

    }]);

  });



}

export default test;
