'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import getTopLevelType            from 'syn/../../dist/api/get-top-level-type';

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
                console.log({ type });
                ok();
              },
              ko
            );
        }));
      });

    }
  );
}

export default test;
