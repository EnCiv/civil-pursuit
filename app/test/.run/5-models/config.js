'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isConfig             from 'syn/../../dist/test/is/config';
import Config               from 'syn/../../dist/models/config';

function test () {
  const locals = {};

  return describe ( 'Models/Config', it => {

    it('set', it => {

      it('should create a lambda config', () => new Promise((ok, ko) => {
        Config.set('lambda', true).then(
          document => {
            locals.lambda = document;
            ok();
          },
          ko
        );
      }));

      it('should be a config', describe.use(() => isConfig(locals.lambda)));

    });

    it('get', it => {

      it('should get lambda', () => new Promise((ok, ko) => {
        Config.get('lambda').then(
          lambda => {
            lambda.should.be.true();
            ok();
          },
          ko
        );
      }));

    });

  });
}

export default test;
