'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import selectors              from 'syn/../../selectors.json';
import isJoinForm             from 'syn/../../dist/test/is/join-form';

function test(props) {
  const locals = {
    subject : 'This is a subject',
    description : 'This is a description'
  };

  return testWrapper(
    'Story -> Join -> Twitter',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should click Join button', () => wrappers.driver.client.click(
        selectors.join.button
      ));

      describe.pause(2000)(it);

      it('should be a Join form', describe.use(() => isJoinForm(wrappers.driver)));

      it('should click on Join with Twitter', () =>
        wrappers.driver.client.click(selectors.join.twitter)
      );

      describe.pause(3500)(it);

      it('should be in twitter', () =>
        wrappers.driver.hasUrl(/api\.twitter\.com/)
      );

      it('should fill username', () => wrappers.driver.client.setValue(
        '#username_or_email', process.env.TEST_TWITTER_EMAIL
      ));

      it('should fill username', () => wrappers.driver.client.setValue(
        '[name="session[password]"]', process.env.TEST_TWITTER_PASSWORD + "\n"
      ));

      describe.pause(3500)(it);

      it('should be back to synapp', () =>
        wrappers.driver.hasUrl(/\/page\/profile/)
      );

      it('Cookie', it => {
        it('should have cookie', () => new Promise((ok, ko) => {
          wrappers.driver.client.getCookie('synuser').then(cookie => {
            try {
              cookie.should.be.an.Object()
                .and.have.property('value')
                .which.is.a.String();

              const value = JSON.parse(decodeURIComponent(cookie.value).replace(/^j:/, ''));

              value.should.be.an.Object()
                .and.have.property('email')
                .which.endWith('@twitter.com');

              value.should.have.property('id')
                .which.is.a.String();

              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }, ko);
        }));
      });

    }
  );
}

export default test;
