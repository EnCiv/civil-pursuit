'use strict';

import describe             from 'redtea';
import config               from 'syn/../../dist/../public.json';
import { Evaluation }       from 'syn/../../dist/lib/app/evaluate';
import Type                 from 'syn/../../dist/models/type';
import isType               from './type';
import isObjectID           from './object-id';
import isPanelItem          from './panel-item';
import isCriteria           from './criteria';

function isEvaluation (evaluation, user, item, type, serialized = false) {
  const locals = {};

  return it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    if ( serialized ) {
      it('should be an object', (ok, ko) => {
        evaluation.should.be.an.Object();
      });
    }
    else {
      it('should be an Evaluation', (ok, ko) => {
        evaluation.should.be.an.instanceof(Evaluation);
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Type', [ it => {
      it('convert to type if not a Type', () => new Promise((ok, ko) => {
        if ( type instanceof Type ) {
          return ok();
        }
        Type.findById(type).then(
          document => {
            type = document;
            ok();
          },
          ko
        );
      }));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('type', [ it => {
      it('should have property type', (ok, ko) => {
        evaluation.should.have.property('type');
      });

      it('should be a type', describe.use(() => isType(evaluation.type, { _id : item.type })));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('item', [ it => {
      it('should have property item', (ok, ko) => {
        evaluation.should.have.property('item');
      });

      it('should be an object ID', describe.use(() => isObjectID(evaluation.item, item._id)));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('items', [ it => {
      it('should have property items', (ok, ko) => {
        evaluation.should.have.property('items');
      });
      it('should be an array', (ok, ko) => {
        evaluation.items.should.be.an.Array();
      });
      it(`should not have more than ${config['navigator batch size']} items`, (ok, ko) => {
        evaluation.items.length.should.be.below((config['navigator batch size'] + 1));
      });

      evaluation.items.forEach(item => it('should be a panel item', describe.use(() => isPanelItem(item))));
    }]);

    it('criterias', [ it => {
      it('should have property criterias', (ok, ko) => {
        evaluation.should.have.property('criterias');
      });
      it('should be an array', (ok, ko) => {
        evaluation.criterias.should.be.an.Array();
      });
      evaluation.criterias.forEach(criteria => it('should be a criteria', describe.use(() => isCriteria(criteria))));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Position', [ it => {
      it('should have a position', (ok, ko) => {
        evaluation.should.have.property('position');
      });
      it('should be the same than in config', (ok, ko) => {
        evaluation.position.should.be.exactly(config["evaluation context item position"]);
      });
      if ( evaluation.position === 'first' ) {
        it('evaluee should be the first item', (ok, ko) => {
          evaluation.items[0]._id.toString().should.be.exactly(evaluation.item);
        });
      }
      if ( evaluation.position === 'last' ) {
        it('evaluee should be the last item', (ok, ko) => {
          const lastItem = evaluation.items.reduce((last, item) => {
            last = item;
            return last;
          }, null);
          lastItem._id.toString().should.be.exactly(evaluation.item.toString());
        });
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('split', [ it => {
      it('should have property split', (ok, ko) => {
        evaluation.should.have.property('split');
      });

      it('split should match type', (ok, ko) => {
        type.isHarmony().then(
          isHarmony => {
            evaluation.split.should.be.exactly(isHarmony);
          },
          ko
        );
      });

      if ( evaluation.split ) {
        it('Evaluation is split', [it => {
          it('Opposite',  [ it => {
            it('should get opposite type', () => new Promise( (ok, ko) => {
              type.getOpposite().then(
                opposite => {
                  locals.opposite = opposite;
                  ok();
                },
                ko
              );
            }));

            it('opposite should be a type', describe.use(() => isType(locals.opposite)));
          }]);

          it('Should be a split of two harmonies', [ it => {
            if ( evaluation.items.length === 1 ) {
              it('should be the right type', (ok, ko) => {
                evaluation.items[0].type._id.toString()
                  .should.be.exactly(type._id.toString());

              });
            }

            else {
              for ( let i = 0; i < evaluation.items.length ; i ++ ) {
                const pos = config["evaluation context item position"] === 'first' ? ! i % 2 : i % 2;

                it(`item #${i} should be of expected type`, (ok, ko) => {
                  const rightType = pos ? type : locals.opposite;

                  evaluation.items[i].type._id.toString()
                    .should.be.exactly(rightType._id.toString());

                });
              }
            }
          }]);
        }]);
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  };
}

export default isEvaluation;
