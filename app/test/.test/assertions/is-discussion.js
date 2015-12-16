'use strict';

import should                       from 'should';
import Mungo                        from 'mungo';
import describe                     from 'redtea';
import Discussion                   from '../../../models/discussion';
import isDocument                   from './is-document';
import isObjectId                   from './is-object-id';

function isDiscussion (discussion, compare = {}, serialized = false) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(discussion, compare, serialized)));

    if ( ! serialized ) {
      it('should be a discussion', (ok, ko) => {
        discussion.should.be.an.instanceof(Discussion);
        ok();
      });
    }

    it('should have a subject', (ok, ko) => {
      discussion.should.have.property('subject').which.is.a.String();
      ok();
    });

    if ( 'subject' in compare ) {
      it('subject should match compare', (ok, ko) => {
        discussion.subject.should.be.exactly(compare.subject);
        ok();
      });
    }

    it('should have a description', (ok, ko) => {
      discussion.should.have.property('description').which.is.a.String();
      ok();
    });

    if ( 'description' in compare ) {
      it('description should match compare', (ok, ko) => {
        discussion.description.should.be.exactly(compare.description);
        ok();
      });
    }

    it('should have a deadline', (ok, ko) => {
      discussion.should.have.property('deadline').which.is.an.instanceof(Date);
      ok();
    });

    if ( 'deadline' in compare ) {
      it('deadline should match compare', (ok, ko) => {
        (+(discussion.deadline)).should.be.exactly((+(compare.deadline)));
        ok();
      });
    }

    it('should have a starts', (ok, ko) => {
      discussion.should.have.property('starts').which.is.an.instanceof(Date);
      ok();
    });

    if ( 'starts' in compare ) {
      it('starts should match compare', (ok, ko) => {
        (+(discussion.starts)).should.be.exactly((+(compare.starts)));
        ok();
      });
    }

    it('should have a goal', (ok, ko) => {
      discussion.should.have.property('goal').which.is.a.Number();
      ok();
    });

    if ( 'goal' in compare ) {
      it('goal should match compare', (ok, ko) => {
        discussion.goal.should.be.exactly(compare.goal);
        ok();
      });
    }

    it('should have registered users', (ok, ko) => {
      discussion.should.have.property('registered').which.is.an.Array();
      ok();
    });

    if ( discussion.registered.length ) {
      discussion.registered.forEach((user, index) => it(`registered user #${index} should be an object id`, describe.use(() => isObjectId(user))));
    }

    if ( 'registered' in compare ) {
      compare.registered.forEach(user => discussion.registered.some(registeredUser => registeredUser.toString() === user.toString()).should.be.true());
    }
  }
}

export default isDiscussion;
