'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Discussion             from 'syn/../../dist/models/discussion';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Discussion',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Create discussion', () =>
        Discussion.create({
          subject       :   'This is a discussion',
          description   :   'This is a description',
          deadline      :   new Date(Date.now() + 60000),
          starts        :   new Date(Date.now() - 1000),
          goal          :   5
        })
        .then(discussion => { locals.discussion = discussion })
      );

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      describe.pause(60000)(it);

    }
  );
}

export default test;
