'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import getEvaluation              from 'syn/../../dist/api/get-evaluation';
import isEvaluation               from 'syn/../../dist/test/is/evaluation';
import Item                       from 'syn/../../dist/models/item';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Evaluation', it => {
    it('Item', [ it => {
      it('should be a function', (ok, ko) => {
        getEvaluation.should.be.a.Function();
      });

      it('should create item',() => new Promise((ok, ko) => {
        Item.lambda().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));
    }]);

    it('Get Evaluation from socket', [ it => {
      it('Get Evaluation', () => new Promise((ok, ko) => {
        mock(props.socket, getEvaluation, 'get evaluation', locals.item)
          .then(
            evaluation => {
              locals.evaluation = evaluation;
              ok();
            },
            ko
          );
      }));
    }]);

    it('should be an evaluation', describe.use(() => isEvaluation(locals.evaluation, locals.item.user, locals.item, locals.item.type)));
  });
}

export default test;
