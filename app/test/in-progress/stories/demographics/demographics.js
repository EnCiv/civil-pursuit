'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import selectors              from 'syn/../../selectors.json';
import Agent                  from 'syn/../../dist/lib/app/agent';
import emitter                from 'syn/../../dist/lib/app/emitter';

function test(props) {
  const locals = {};

  function listenToUpdate (wait = 2000) {
    return it => {
      it('Listen to user update', () => new Promise((ok, ko) => {
        let listened = false;

        const listener = (collection, document) => {
          if ( collection === 'users' &&
            document._id.equals(locals.user._id) ) {
              listened = true;
              locals.user = document;
              ok();
            }
        };

        emitter.on('update', listener);

        setTimeout(() => {
          if ( ! listened ) {
            User.findById(locals.user).then(
              user => {
                if ( user.image ) {
                  locals.user = user;
                  ok();
                }
                else {
                  ko(new Error('Time out after 15 seconds while waiting for user to update'));
                }
              }
            ).catch(ko);
          }
        }, wait);
      }));
    }
  };

  return testWrapper(
    'Story -> Demographics',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });
      });

      it('should go home', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should go to profile', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/page/profile`)
      );

      it('should see Demographics panel', () => wrappers.driver.isVisible(
        selectors.demographics.selector, 2500
      ));

      describe.pause(15000)(it);

    }
  );
}

export default test;
