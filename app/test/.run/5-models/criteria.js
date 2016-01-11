'use strict';

import Mungo                          from 'mungo';
import should                         from 'should';
import describe                       from 'redtea';
import isCriteria                     from 'syn/../../dist/test/is/criteria';
import Criteria                        from 'syn/../../dist/models/criteria';

const { Describer } = describe;

function test () {
  const locals = {};

  return describe ( 'Models/Criteria', it => {

    it('should get random criteria', () => new Promise((ok, ko) => {
        Criteria.findOneRandom().then(
          criteria => {
            locals.criteria = criteria;
            ok();
          },
          ko
        );
      })
    );

    it('should be a criteria', describe.use(() => isCriteria(locals.criteria)));

  });
}

export default test;
