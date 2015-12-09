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
    
    //
    // it('should have a name', (ok, ko) => {
    //   type.should.have.property('name').which.is.a.String();
    //   ok();
    // });
    //
    // if ( 'name' in compare ) {
    //   it('name should match compare', (ok, ko) => {
    //     type.name.should.be.exactly(compare.name);
    //     ok();
    //   });
    // }
  };

}

export default isUser;
