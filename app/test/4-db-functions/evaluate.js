'use strict';

import should                         from 'should';
import describe                       from 'redtea';
import { EventEmitter }               from 'events';
import { Evaluation, Evaluator }      from '../../lib/app/evaluate';
import User                           from '../../models/user';
import Type                           from '../../models/type';
import Item                           from '../../models/item';
import isEvaluation                   from '../../lib/assertions/is-evaluation';

function evaluate (evaluation, user, item, type) {
  const locals = {};

  return it => {
    it('should be an instance of Evaluator', (ok, ko) => {
      evaluation.should.be.an.instanceof(Evaluator);
      ok();
    });

    it('should be an instance of EventEmitter', (ok, ko) => {
      evaluation.should.be.an.instanceof(EventEmitter);
      ok();
    });

    it('itemId', [ it => {
      it('should have itemId', (ok, ko) => {
        evaluation.should.have.property('itemId');
        ok();
      });

      it('should be the same than item', (ok, ko) => {
        evaluation.itemId.equals(item._id).should.be.true();
        ok();
      });
    }]);

    it('userId', [ it => {
      it('should have userId', (ok, ko) => {
        evaluation.should.have.property('userId');
        ok();
      });

      it('should be the same than user', (ok, ko) => {
        evaluation.userId.equals(user._id).should.be.true();
        ok();
      });
    }]);

    it('type', [ it => {
      it('should have type', (ok, ko) => {
        evaluation.should.have.property('type');
        ok();
      });


      it('should be regular', (ok, ko) => {
        evaluation.type.should.be.exactly('regular');
        ok();
      });
    }]);

    it('evaluate', [ it => {
      it('should have an evaluate method', (ok, ko) => {
        evaluation.should.have.property('evaluate').which.is.a.Function();
        ok();
      });

      it('should be a promise', (ok, ko) => {
        locals.evaluate = evaluation.evaluate();
        locals.evaluate.should.be.an.instanceof(Promise);
        ok();
      });

      it('should fulfill', (ok, ko) => {
        locals.evaluate.then(
          results => {
            locals.results = results;
            console.log(require('util').inspect(results, { depth: null }));
            ok();
          },
          ko
        );
      });

      it('Results', describe.use(() => isEvaluation(locals.results, user, item, type)));
    }]);
  };
}

function test () {

  const locals = {};

  return describe ( 'Lib / App / Evaluate' , [
    {
      'should Evaluator be a function' : (ok, ko) => {
        Evaluator.should.be.a.Function();
        ok();
      }
    },
    {
      'should Evaluation be a function' : (ok, ko) => {
        Evaluation.should.be.a.Function();
        ok();
      }
    },
    {
      'should get random user' : (ok, ko) => {
        User.findOneRandom().then(
          user => {
            locals.user = user;
            ok();
          },
          ko
        );
      }
    },
    {
      'should create a group of types' : (ok, ko) => {
        Type.group('Evaluation parent', 'Evaluation subtype', 'Evaluation pro', 'Evaluation con').then(
          group => {
            locals.group = group;
            ok();
          },
          ko
        );
      }
    },
    {
      'should create a parent item' : (ok, ko) => {
        Item.lambda({ type : locals.group.parent }).then(
          item => {
            locals.parent = item;
            ok();
          },
          ko
        );
      }
    },
    {
      'Evaluate parent item' : describe.use(() => evaluate(new Evaluator(locals.user, locals.parent), locals.user, locals.parent, locals.group.parent))
    }
  ] );

}

export default test;
