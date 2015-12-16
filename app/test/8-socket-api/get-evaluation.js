'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getEvaluation              from '../../api/get-evaluation';
import isEvaluation               from '../.test/assertions/is-evaluation';
import Item                       from '../../models/item';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Evaluation', it => {
    it('Item', [ it => {
      it('should be a function', (ok, ko) => {
        getEvaluation.should.be.a.Function();
        ok();
      });

      it('should create item',(ok, ko) => {
        Item.lambda().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      });
    }]);

    it('Get Evaluation from socket', [ it => {
      it('Get Evaluation', (ok, ko) => {
        mock(props.socket, getEvaluation, 'get evaluation', locals.item)
          .then(
            evaluation => {
              locals.evaluation = evaluation;
              ok();
            },
            ko
          );
      });
    }]);

    it('should be an evaluation', describe.use(() => isEvaluation(locals.evaluation, locals.item.user, locals.item, locals.item.type)));
  });
}

export default test;
