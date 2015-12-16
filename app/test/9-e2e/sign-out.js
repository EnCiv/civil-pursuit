'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import signOut                            from '../.test/util/e2e-sign-out';
// import signIn                             from '../.test/util/e2e-sign-in';
// import isTopBar                           from '../.test/util/e2e-is-top-bar';

function test(props) {
  const locals = {
    signOutButton : '.syn-top_bar-sign-out-button i'
  };

  return describe('E2E Sign Out', it => {
    it('should go to home page if no top bar found', (ok, ko) => {
      props.driver.client.isVisible('header[role="banner"].syn-top_bar').then(
        ok,
        error => {
          props.driver.client.url(`http://localhost:${props.port}`).then(ok, ko);
        }
      );
    });

    it('should create a User to sign in with', (ok, ko) => {
      User.lambda().then(
        user => {
          locals.user = user;
          ok();
        },
        ko
      );
    });

    it('should set cookie', (ok, ko) => {
      props.driver.client.setCookie({
        name : 'synuser',
        value :  JSON.stringify({
          id : locals.user._id
        })
      }).then(ok, ko);
    });

    it('should refresh', (ok, ko) => {
      props.driver.client.refresh().then(ok, ko);
    });

    it('should sign out', describe.use(() => signOut(props.driver.client)));

    it('should pause 2 seconds', (ok, ko) => {
      props.driver.client.pause(1000 * 2).then(ok, ko);
    });

    it('should be at home page', (ok, ko) => {
      props.driver.client.url().then(
        url => {
          url.should.be.an.Object()
            .and.have.property('value')
            .which.is.exactly(`http://localhost:${props.port}/`);
          ok();
        },
        ko
      );
    });

    it('should not have cookie', (ok, ko) => {
      props.driver.client.getCookie('synuser').then(cookie => {
        try {
          should(cookie).be.null();

          ok();
        }
        catch ( error ) {
          ko(error);
        }
      }, ko);
    });

    it('should not have a sign out button anymore', (ok, ko) => {
      props.driver.client.isVisible(locals.signOutButton).then(
        isVisible => {
          isVisible.should.be.false();
          ok();
        },
        ok
      );
    });

  });
}

export default test;
