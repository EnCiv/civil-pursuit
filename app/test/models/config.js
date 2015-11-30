'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import isConfig             from '../../lib/assertions/config';
import Config               from '../../models/config';

function test () {
  const locals = {};

  return describe ( 'Models/Config', [

    {
      'set' : [
        {
          'should create a lambda config' : (ok, ko) => {
            Config.set('lambda', true).then(
              document => {
                locals.lambda = document;
                ok();
              },
              ko
            );
          }
        },
        {
          'should be a config' : (ok, ko) => {
            locals.lambda.should.be.a.config();
            ok();
          }
        }
      ]
    },
    {
      'get' : [
        {
          'should get lambda' : (ok, ko) => {
            Config.get('lambda').then(
              lambda => {
                lambda.should.be.true();
                ok();
              },
              ko
            );
          }
        }
      ]
    }

  ]);
}

export default test;
