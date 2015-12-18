'use strict';

import Mungo                          from 'mungo';
import should                         from 'should';
import describe                       from 'redtea';
import isCriteria                     from '../.test/assertions/is-criteria';
import Criteria                        from '../../models/criteria';

const { Describer } = describe;

function test () {
  const locals = {};

  return describe ( 'Models/Criteria', [

    {
      'should get random criteria' : () => new Promise((ok, ko) => {
        Criteria.findOneRandom().then(
          criteria => {
            locals.criteria = criteria;
            ok();
          },
          ko
        );
      })
    },

    {
      'should be a criteria' : new Describer(() => isCriteria(locals.criteria))
    }

  ]);
}

export default test;
