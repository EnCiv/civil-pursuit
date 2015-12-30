'use strict';

import should                         from 'should';
import describe                       from 'redtea';
import { EventEmitter }               from 'events';
import config                         from 'syn/../../dist/../public.json';
import { Evaluation, Evaluator }      from 'syn/../../dist/lib/app/evaluate';
import User                           from 'syn/../../dist/models/user';
import Type                           from 'syn/../../dist/models/type';
import Item                           from 'syn/../../dist/models/item';
import isEvaluation                   from 'syn/../../dist/test/assertions/is-evaluation';
import isItem                         from 'syn/../../dist/test/assertions/is-item';

function evaluate (evaluation, user, item, type) {
  const locals = {};

  console.log({ evaluation })

  return it => {
    it('should be an instance of Evaluator', (ok, ko) => {
      evaluation.should.be.an.instanceof(Evaluator);
    });

    it('should be an instance of EventEmitter', (ok, ko) => {
      evaluation.should.be.an.instanceof(EventEmitter);
    });

    it('itemId', [ it => {
      it('should have itemId', (ok, ko) => {
        evaluation.should.have.property('itemId');
      });

      it('should be the same than item', (ok, ko) => {
        evaluation.itemId.equals(item._id).should.be.true();
      });
    }]);

    it('userId', [ it => {
      it('should have userId', (ok, ko) => {
        evaluation.should.have.property('userId');
      });

      it('should be the same than user', (ok, ko) => {
        evaluation.userId.equals(user._id).should.be.true();
      });
    }]);

    it('type', [ it => {
      it('should have type', (ok, ko) => {
        evaluation.should.have.property('type');
      });


      it('should be regular', (ok, ko) => {
        evaluation.type.should.be.exactly('regular');
      });
    }]);

    it('evaluate', [ it => {
      it('should have an evaluate method', (ok, ko) => {
        evaluation.should.have.property('evaluate').which.is.a.Function();
      });

      it('should be a promise', (ok, ko) => {
        locals.evaluate = evaluation.evaluate();
        locals.evaluate.should.be.an.instanceof(Promise);
      });

      it('should fulfill', () => new Promise((ok, ko) => {
        locals.evaluate.then(
          results => {
            locals.results = results;
            // console.log(require('util').inspect(results, { depth: null }));
            ok();
          },
          ko
        );
      }));

      it('Results', describe.use(() => isEvaluation(locals.results, user, item, type)));
    }]);
  };
}

function test () {

  const locals = {};

  return describe ( 'Lib / App / Evaluate' , it => {
    it('should Evaluator be a function', (ok, ko) => {
      Evaluator.should.be.a.Function();
    });
    it('should Evaluation be a function', (ok, ko) => {
      Evaluation.should.be.a.Function();
    });
    it('should get random user', () => new Promise((ok, ko) => {
      User.findOneRandom().then(
        user => {
          locals.user = user;
          ok();
        },
        ko
      );
    }));
    it('should create a group of types', () => new Promise((ok, ko) => {
      Type.group('Evaluation parent', 'Evaluation subtype', 'Evaluation pro', 'Evaluation con').then(
        group => {
          locals.group = group;
          ok();
        },
        ko
      );
    }));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Parent item', [ it => {
      for ( let i = 0; i < (config["navigator batch size"] + 1) ; i ++ ) {
        it(`Parent item #${i}`, [ it => {
          it('should create a parent item', () => new Promise((ok, ko) => {
            Item.lambda({ type : locals.group.parent }).then(
              item => {
                locals.parent = item;
                locals.evaluation = new Evaluator(locals.user, locals.parent);
                ok();
              },
              ko
            );
          }));

          it('Evaluate parent item', describe.use(() => evaluate(locals.evaluation, locals.user, locals.parent, locals.group.parent)));

          let itemsLength = (i + 1);

          if ( i >= config["navigator batch size"] ) {
            itemsLength = config["navigator batch size"];
          }

          it(`should have ${itemsLength} items`, () => new Promise((ok, ko) => {
            locals.evaluation.evaluate().then(
              evaluation => {
                try {
                  evaluation.items.should.have.length(itemsLength);
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
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Subtype item', [ it => {
      for ( let i = 0; i < (config["navigator batch size"] + 1) ; i ++ ) {
        it(`Subtype item #${i}`, [ it => {
          it('should create a subtype item', () => new Promise((ok, ko) => {
            Item.lambda({ type : locals.group.subtype }).then(
              item => {
                locals.subtype = item;
                locals.evaluation = new Evaluator(locals.user, locals.subtype);
                ok();
              },
              ko
            );
          }));

          it('Evaluate subtype item', describe.use(() => evaluate(locals.evaluation, locals.user, locals.subtype, locals.group.subtype)));

          let itemsLength = (i + 1);

          if ( i >= config["navigator batch size"] ) {
            itemsLength = config["navigator batch size"];
          }

          it(`should have ${itemsLength} items`, () => new Promise((ok, ko) => {
            locals.evaluation.evaluate().then(
              evaluation => {
                try {
                  evaluation.items.should.have.length(itemsLength);
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
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Pro item', [ it => {

      for ( let i = 0; i < (config["navigator batch size"] + 1) ; i ++ ) {
        it(`Pro item #${i}`, [ it => {
          it('should create a pro item', () => new Promise((ok, ko) => {
            Item.lambda({ type : locals.group.pro }).then(
              item => {
                locals.pro = item;
                locals.evaluation = new Evaluator(locals.user, locals.pro);
                ok();
              },
              ko
            );
          }));

          it('should be an item', describe.use(() => isItem(locals.pro)));

          it('Evaluate pro item', describe.use(() => evaluate(locals.evaluation, locals.user, locals.pro, locals.group.pro)));

          it(`should have 1 item`, () => new Promise((ok, ko) => {
            locals.evaluation.evaluate().then(
              evaluation => {
                try {
                  evaluation.items.should.have.length(1);
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
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Con item', [ it => {

      for ( let i = 0; i < (config["navigator batch size"] + 1) ; i ++ ) {

        it(`Con item #${i}`, [ it => {
          it('should create a con item', () => new Promise((ok, ko) => {
            Item.lambda({ type : locals.group.con }).then(
              item => {
                locals.con = item;
                locals.evaluation = new Evaluator(locals.user, locals.con);
                ok();
              },
              ko
            );
          }));

          it('should be an item', describe.use(() => isItem(locals.con)));

          it('Evaluate con item', describe.use(() => evaluate(locals.evaluation, locals.user, locals.con, locals.group.con)));

          let itemsLength = ((i + 1) * 2);

          if ( itemsLength >= config["navigator batch size"] ) {
            itemsLength = config["navigator batch size"];
          }

          it(`should have ${itemsLength} items`, () => new Promise((ok, ko) => {
            locals.evaluation.evaluate().then(
              evaluation => {
                try {
                  evaluation.items.should.have.length(itemsLength);
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
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  });

}

export default test;
