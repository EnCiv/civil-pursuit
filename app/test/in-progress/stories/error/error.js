'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Error',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('should go to error page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/error`)
      );

      describe.pause(15000)(it);

    }
  );
}

export default test;
