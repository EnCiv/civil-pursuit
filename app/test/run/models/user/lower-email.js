'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from '../../../../lib/app/test-wrapper';
import isUser               from '../../../../test/is/user';
import User                 from '../../../../models/user';

function test () {
  const locals = {
    email : 'TEST-USER-LOWER-EMAIL@test.com'
  };

  return testWrapper('User Model -> Lower Email',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('Create a new user with uppercase email',
        () => User.create(
          { email : locals.email, password : '1djhd673?' }
        )
        .then(user => { locals.user = user })
      );

      it('email should be in lower case',
        () => locals.user.should.have.property('email')
          .which.is.exactly(locals.email.toLowerCase())
      );

    }
  );
}

export default test;
