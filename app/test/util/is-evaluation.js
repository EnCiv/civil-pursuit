'use strict';

import { Evaluation }       from '../../lib/app/evaluate';
import isType               from './is-type';
import isItem               from './is-item';
import describe             from '../../lib/util/describe';

const { Describer } = describe;

function isEvaluation (evaluation, item, serialized = false) {
  const suite = [];

  const split = {
    'should have a property split which is a boolean' : (ok, ko) => {
      evaluation.should.have.property('split').which.is.a.Boolean();
      ok();
    }
  };

  const type = [
    {
      'should have property type' : (ok, ko) => {
        evaluation.should.have.property('type');
        ok();
      }
    },
    {
      'should be a type' : new Describer(() => isType(evaluation.type, { _id : item.type }))
    }
  ];

  const shouldHaveItem = [
    {
      'should have property item' : (ok, ko) => {
        evaluation.should.have.property('item');
        ok();
      }
    },
    {
      'should be an item' : new Describer(() => isItem(evaluation.item))
    }
  ];

  if ( serialized ) {
    suite.push(
      {
        'should be serialized' : (ok, ko) => ok()
      },
      {
        'should be an object' : (ok, ko) => {
          evaluation.should.be.an.Object();
          ok();
        }
      },
      split,
      ...type,
      ...shouldHaveItem
    );
  }
  else {
    suite.push(
      {
        'should not be serialized' : (ok, ko) => ok()
      },
      {
        'should be an instance of evaluation' : (ok, ko) => {
          evaluation.should.be.an.instanceof(Evaluation);
          ok();
        }
      },
      split,
      ...type,
      ...shouldHaveItem
    );
  }

  return suite;
}

export default isEvaluation;
