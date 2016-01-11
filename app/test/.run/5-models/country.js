'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isCountry            from 'syn/../../dist/test/is/country';
import Country              from 'syn/../../dist/models/country';

function test () {
  const locals = {};

  return describe ( 'Models/Country', it => {

    it('should get random country', () => new Promise((ok, ko) => {
      Country.findOneRandom().then(
        country => {
          locals.country = country;
          ok();
        },
        ko
      );
    }));

    it('should be a country', describe.use(() => isCountry(locals.country)));

  });
}

export default test;
