'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Page Not Found',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('should go to a not found page', () =>
        wrappers.driver.client.url(`http://localhost:${wrappers.http.app.get('port')}/not/found`)
      );

      it('should have a header message that says "Not found"', () => wrappers.driver.hasText('#not-found .syn-panel-heading h4', 'Not found'));

    }
  );
}

export default test;
