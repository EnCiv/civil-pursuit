'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import User                       from 'syn/../../dist/models/user';
import signOut                    from 'syn/../../dist/test/util/e2e-sign-out';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import Config                     from 'syn/../../dist/models/config';
import Item                       from 'syn/../../dist/models/item';
import identify                   from 'syn/../../dist/test/util/e2e-identify';

function test(props) {
  const locals = {
  };

  return testWrapper(
    'Story -> Evalaute -> Promote item up',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });

        it('should create a new top level item', it => {
          it('should get top level from config',
            () => Config.get('top level type')
              .then(topLevelType => { locals.topLevelType = topLevelType })
          );

          it('should create item', () =>
            Item.
              lambda({
                type : locals.topLevelType,
                subject : 'Top level type item #1'
              })
              .then(item => { locals.item = item })
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

    }
  );
}

export default test;
