'use strict';

import describe             from 'redtea';
import config               from '../../../public.json';
import { Evaluation }       from '../app/evaluate';
import isType               from './is-type';
import isObjectID           from './is-object-id';
import isPanelItem          from './is-panel-item';
import isCriteria           from './is-criteria';

function isEvaluation (evaluation, user, item, type, serialized = false) {
  const locals = {};

  return it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    if ( serialized ) {
      it('should be an object', (ok, ko) => {
        evaluation.should.be.an.Object();
        ok();
      });
    }
    else {
      it('should be an Evaluation', (ok, ko) => {
        evaluation.should.be.an.instanceof(Evaluation);
        ok();
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('type', [ it => {
      it('should have property type', (ok, ko) => {
        evaluation.should.have.property('type');
        ok();
      });

      it('should be a type', describe.use(() => isType(evaluation.type, { _id : item.type })));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('item', [ it => {
      it('should have property item', (ok, ko) => {
        evaluation.should.have.property('item');
        ok();
      });

      it('should be an object ID', describe.use(() => isObjectID(evaluation.item, item._id)));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('items', [ it => {
      it('should have property items', (ok, ko) => {
        evaluation.should.have.property('items');
        ok();
      });
      it('should be an array', (ok, ko) => {
        evaluation.items.should.be.an.Array();
        ok();
      });
      it(`should not have more than ${config['navigator batch size']} items`, (ok, ko) => {
        evaluation.items.length.should.be.below((config['navigator batch size'] + 1));
        ok();
      });

      evaluation.items.forEach(item => it('should be a panel item', describe.use(() => isPanelItem(item))));
    }]);

    it('criterias', [ it => {
      it('should have property criterias', (ok, ko) => {
        evaluation.should.have.property('criterias');
        ok();
      });
      it('should be an array', (ok, ko) => {
        evaluation.criterias.should.be.an.Array();
        ok();
      });
      evaluation.criterias.forEach(criteria => it('should be a criteria', describe.use(() => isCriteria(criteria))));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('split', [ it => {
      it('should have property split', (ok, ko) => {
        evaluation.should.have.property('split');
        ok();
      });

      it('split should match type', (ok, ko) => {
        type.isHarmony().then(
          isHarmony => {
            evaluation.split.should.be.exactly(isHarmony);
            ok();
          },
          ko
        );
      });

      if ( evaluation.split ) {
        it('Evaluation is split', [it => {
          it('Opposite',  [ it => {
            it('should get opposite type', (ok, ko) => {
              type.getOpposite().then(
                opposite => {
                  locals.opposite = opposite;
                  ok();
                },
                ko
              );
            });

            it('opposite should be a type', describe.use(() => isType(locals.opposite)));
          }]);

          it('Should be a split of two harmonies', [ it => {
            for ( let i = 0; i < evaluation.items.length ; i ++ ) {
              it('item should be the right type', (ok, ko) => {
                evaluation.items[i].type._id.toString().should.be.exactly(
                  i % 2 ? type._id.toString() : locals.opposite._id.toString()
                );
                ok();
              })
            }
          }]);
        }]);
      }
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Position', [ it => {
      it('should have a position', (ok, ko) => {
        evaluation.should.have.property('position');
        ok();
      });
      it('should be the same than in config', (ok, ko) => {
        evaluation.position.should.be.exactly(config["evaluation context item position"]);
        ok();
      });
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  };
}

export default isEvaluation;
