'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from 'syn/../../dist/lib/app/test-wrapper';
import isConfig             from 'syn/../../dist/test/is/config';
import Config               from 'syn/../../dist/models/config';

function test () {
  const locals = {};

  return testWrapper('Config Model -> Get',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('Create a config', it => {

        it('should create a new config in DB',
          () => Config.set('foo', 22)
        );

      });

      it('Get config', it => {

        it('should get config',
          () => Config.get('foo').then(config => { locals.config = config })
        );

        it('should have the right value',
          () => locals.config.should.be.exactly(22)
        );

      });

    }
  );
}

export default test;
