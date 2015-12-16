'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import config               from '../../../public.json';
import describe             from 'redtea';
import makePanel            from '../../lib/app/make-panel';
import Type                 from '../../models/type';
import Item                 from '../../models/item';
import isType               from '../.test/assertions/is-type';

const { Describer } = describe;

function test () {

  const locals = {};

  return describe ( 'Lib / App / Make Panel' , it => {

    it('should be a function', (ok, ko) => {
      makePanel.should.be.a.Function();
      ok();
    });

    it('should throw an error if no type passed', [ it => {
      it('as an object', (ok, ko) => {
        try {
          makePanel({});
          ko(new Error('Should have thrown'));
        }
        catch ( error ) {
          ok();
        }
      });
    }]);

    it('As an object', [ it => {

      it('Type only', [ it => {

        it('should create a type', (ok, ko) => {
          Type.create({ name : 'test make panel - parent'}).then(
            type => {
              locals.type = type;
              ok();
            },
            ko
          );
        });

        it('should make panel', (ok, ko) => {
          locals.panel = makePanel({ type : locals.type });
          locals.panel.should.be.an.Object();
          ok();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
            ok();
          });

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
            ok();
          });

          it('should type be a type', new Describer(() => isType(locals.panel.panel.type, locals.type))
          );

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
            ok();
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
            ok();
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
          ok();
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
          ok();
        });

      }]);

      it('With parent', [ it => {

        it('should create a subtype', (ok, ko) => {
          Type.create({ name : 'test make panel - subtype', parent : locals.type }).then(
            type => {
              locals.subtype = type;
              ok();
            },
            ko
          );
        });

        it('should create a parent item', (ok, ko) => {
          Item.lambda({ type : locals.type }).then(
            item => {
              locals.parentItem = item;
              ok();
            },
            ko
          );
        });

        it('should make panel', (ok, ko) => {
          locals.panel = makePanel({ type : locals.subtype, parent : locals.parentItem });
          locals.panel.should.be.an.Object();
          ok();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
            ok();
          });


          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
            locals.panel.panel.type._id.equals(locals.subtype._id).should.be.true();
            ok();
          });


          it('should have the same parent', (ok, ko) => {
            locals.panel.panel.should.have.property('parent');
            locals.panel.panel.parent._id.equals(locals.parentItem._id).should.be.true();
            ok();
          });


          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
            ok();
          });


          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
            ok();
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
          ok();
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
          ok();
        });

      }]);
    }]);

    it('As a string', [ it => {

      it('Type only', [ it => {

        it('should make panel', (ok, ko) => {
          locals.panel = makePanel(locals.type._id.toString());
          locals.panel.should.be.an.Object();
          ok();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
            ok();
          });

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type').which.is.an.Object();
            locals.panel.panel.type.should.have.property('_id')
              .which.is.exactly(locals.type._id.toString());
            ok();
          });

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
            ok();
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
            ok();
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
          ok();
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
          ok();
        });

      }]);

      it('With parent', [ it => {

        it('should make panel', (ok, ko) => {
          locals.type = Mungo.ObjectID();
          locals.parent = Mungo.ObjectID();
          locals.panel = makePanel({ type : locals.type, parent : locals.parent });
          locals.panel.should.be.an.Object();
          ok();
        });

        it('panel', [ it => {

          it('should be a panel', (ok, ko) => {
            locals.panel.should.have.property('panel')
              .which.is.an.Object();
            ok();
          });

          it('should have the same type', (ok, ko) => {
            locals.panel.panel.should.have.property('type');
            locals.panel.panel.type.equals(locals.type).should.be.true();
            ok();
          });

          it('should have the same parent', (ok, ko) => {
            locals.panel.panel.should.have.property('parent');
            locals.panel.panel.parent.equals(locals.parent).should.be.true();
            ok();
          });

          it('skip should be 0', (ok, ko) => {
            locals.panel.panel.should.have.property('skip')
              .which.is.exactly(0);
            ok();
          });

          it('limit should be default batch size', (ok, ko) => {
            locals.panel.panel.should.have.property('limit')
              .which.is.exactly(config['navigator batch size']);
            ok();
          });

        }]);

        it('should have an empty array of items', (ok, ko) => {
          locals.panel.should.have.property('items')
            .which.is.an.Array().and.have.length(0);
          ok();
        });

        it('should have a null active', (ok, ko) => {
          locals.panel.should.have.a.property('active')
            .which.is.null();
          ok();
        });

      }]);

    }]);

  });



}

export default test;
