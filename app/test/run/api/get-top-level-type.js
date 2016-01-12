'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import getTopLevelType            from 'syn/../../dist/api/get-top-level-type';
import isType                     from 'syn/../../dist/test/is/type';
import Config                     from 'syn/../../dist/models/config';

function test (props) {
  const locals = {};

  return testWrapper(
    ' API / Get Top Level Type',
    {
      mongodb : true,
      http : true,
      sockets : true
    },
    wrappers => it => {

      it('Get Top Level Type from API', it => {
        it('should get top level type', () => new Promise((ok, ko) => {
          mock(wrappers.apiClient, getTopLevelType, 'get top level type')
            .then(
              type => {
                locals.type = type;
                ok();
              },
              ko
            );
        }));

        it('should be a type', describe.use(() => isType(locals.type, {}, true)));

        it('should get config for top level type',
          () => Config.get('top level type').then(config => { locals.config = config })
        );

        it('should be the same type',
          () => locals.config.equals(locals.type._id).should.be.true()
        );
      });

    }
  );
}

export default test;
