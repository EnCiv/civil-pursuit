'use strict';

import should                           from 'should';
import Mungo                            from 'mungo';
import describe                         from 'redtea';
import Type                             from '../../models/item';
import Item                             from '../../models/item';
import isType                           from './is-type';
import isDocument                       from './is-document';

function isItem (item, compare = {}, serialized = false, populated = []) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(type, compare, serialized)));

    it('subject', [ it => {
      it('should have a subject', (ok, ko) => {
        type.should.have.property('subject').which.is.a.String();
        ok();
      });

      if ( 'subject' in compare ) {
        it('subject should match compare', (ok, ko) => {
          type.subject.should.be.exactly(compare.subject);
          ok();
        });
      }
    }]);

    it('description', [ it => {
      it('should have a description', (ok, ko) => {
        type.should.have.property('description').which.is.a.String();
        ok();
      });

      if ( 'description' in compare ) {
        it('description should match compare', (ok, ko) => {
          type.description.should.be.exactly(compare.description);
          ok();
        });
      }
    }]);
  };
}

export default isItem;
