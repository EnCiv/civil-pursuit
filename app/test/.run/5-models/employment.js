'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isEmployment         from 'syn/../../dist/test/is/employment';
import Employment           from 'syn/../../dist/models/employment';

function test () {
  const locals = {};

  return describe ( 'Employment Model', it => {
    it('should get random employment', () => new Promise((ok, ko) => {
      Employment.findOneRandom().then(
        employment => {
          locals.employment = employment;
          ok();
        },
        ko
      );
    }));

    it('should be a employment', describe.use(() => isEmployment(locals.employment)));
  });
}

export default test;
