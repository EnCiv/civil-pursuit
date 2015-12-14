'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isCountry            from '../.test/assertions/is-country';
import Country              from '../../models/country';

function test () {
  const locals = {};

  return describe ( 'Models/Country', [

    {
      'should get random country' : (ok, ko) => {
        Country.findOneRandom().then(
          country => {
            locals.country = country;
            ok();
          },
          ko
        );
      }
    },

    {
      'should be a country' : describe.use(() => isCountry(locals.country))
    }

  ]);
}

export default test;
