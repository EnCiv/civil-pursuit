'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isEducation          from 'syn/../../dist/test/is/education';
import Education              from 'syn/../../dist/models/education';

function test () {
  const locals = {};

  return describe ( 'Education Model', it => {
    it('should get random education', () => new Promise((ok, ko) => {
      Education.findOneRandom().then(
        education => {
          locals.education = education;
          ok();
        },
        ko
      );
    }));

    it('should be a education', describe.use(() => isEducation(locals.education)));
  });
}

export default test;
