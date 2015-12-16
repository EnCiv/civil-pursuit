'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import isEducation          from '../.test/assertions/is-education';
import Education              from '../../models/education';

function test () {
  const locals = {};

  return describe ( 'Education Model', it => {
    it('should get random education', (ok, ko) => {
      Education.findOneRandom().then(
        education => {
          locals.education = education;
          ok();
        },
        ko
      );
    });

    it('should be a education', describe.use(() => isEducation(locals.education)));
  });
}

export default test;
