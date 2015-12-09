'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import User           from '../../models/user';
import isDocument     from './is-document';

function isUser (user, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(user, compare, serialized)));

    if ( ! serialized ) {
      it('should be a user', (ok, ko) => {
        user.should.be.an.instanceof(User);
        ok();
      });
    }

    it('should have a email', (ok, ko) => {
      user.should.have.property('email').which.is.a.String();
      ok();
    });

    if ( 'email' in compare ) {
      it('email should match compare', (ok, ko) => {
        user.email.should.be.exactly(compare.email);
        ok();
      });
    }

    it('should have a password', (ok, ko) => {
      user.should.have.property('password').which.is.a.String();
      ok();
    });

    if ( 'image' in user ) {
      it('should have an image', (ok, ko) => {
        user.should.have.property('image').which.is.a.String();
        ok();
      });
    }

    if ( 'preferences' in user ) {
      it('preferences', [ it => {
        it('should have preferences', (ok, ko) => {
          user.should.have.property('preferences').which.is.an.Array();
          ok();
        });
        user.preferences.forEach(preference => it('should be a preference', [ it  => {
          it('should be an object', (ok, ko) => {
            preference.should.be.an.Object();
            ok();
          });
        }]));
      }]);
    }
  };

}

export default isUser;
