'use strict';

import should         from 'should';
import Discussion     from '../../models/discussion';
import Mungo          from 'mungo';

should.Assertion.add('discussion', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a discussion', expected: Discussion };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Discussion);
  }

  this.obj.should.have.property('_id');

  if ( serialized )  {
    this.obj._id.should.be.a.String();
  }
  else {
    this.obj._id.should.be.an.instanceof(Mungo.ObjectID);
  }

  this.obj.should.have.property('subject').which.is.a.String();

  if ( 'subject' in candidate ) {
    this.obj.subject.should.be.exactly(candidate.subject);
  }

  this.obj.should.have.property('description').which.is.a.String();

  if ( 'description' in candidate ) {
    this.obj.description.should.be.exactly(candidate.description);
  }

  this.obj.should.have.property('starts').which.is.an.instanceof(Date);

  if ( 'deadline' in candidate ) {
    (+(this.obj.deadline)).should.be.exactly(+(candidate.deadline));
  }

  this.obj.should.have.property('starts').which.is.an.instanceof(Date);

  if ( 'starts' in candidate ) {
    (+(this.obj.starts)).should.be.exactly(+(candidate.starts));
  }

  this.obj.should.have.property('goal').which.is.a.Number();

  if ( 'goal' in candidate ) {
    this.obj.goal.should.be.exactly(candidate.goal);
  }

  this.obj.should.have.property('registered').which.is.an.Array();

  if ( 'registered' in candidate ) {
    this.obj.registered.forEach((user, index) => user.equals(candidate[index]).should.be.true());
  }
});
