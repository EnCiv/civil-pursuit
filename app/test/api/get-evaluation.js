'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import getEvaluation              from '../../api/get-evaluation';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import isEvaluation               from '../util/is-evaluation';

const { Describer } = describe;

function test (props) {
  const locals = {};

  return describe ( ' API / Get Evaluation', [
    {
      'should create a group' : (ok, ko) => {
        Type.group('Evaluate parent', 'Evaluate subtype', 'Evaluate pro', 'Evaluate con').then(
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
            locals.parentItem = item;
            locals.user = item.user;
            ok();
          },
          ko
        );
      }
    },
    {
      'should evaluate parent item' : (ok, ko) => {
        Item.evaluate(locals.user, locals.parentItem).then(
          evaluation => {
            locals.evaluation = evaluation;
            ok();
          },
          ko
        );
      }
    },
    {
      'should be an evaluation' : new Describer(() => isEvaluation(locals.evaluation, locals.parentItem))
    }
  ]);
}

export default test;
