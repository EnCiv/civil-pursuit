'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isConfig             from '../.test/assertions/is-config';
import Config               from '../../models/config';

function test () {
  const locals = {};

  return describe ( 'Models/Config', [

    {
      'set' : [
        {
          'should create a lambda config' : () => new Promise((ok, ko) => {
            Config.set('lambda', true).then(
              document => {
                locals.lambda = document;
                ok();
              },
              ko
            );
          })
        },
        {
          'should be a config' : describe.use(() => isConfig(locals.lambda))
        }
      ]
    },
    {
      'get' : [
        {
          'should get lambda' : () => new Promise((ok, ko) => {
            Config.get('lambda').then(
              lambda => {
                lambda.should.be.true();
                ok();
              },
              ko
            );
          })
        }
      ]
    }

  ]);
}

export default test;
