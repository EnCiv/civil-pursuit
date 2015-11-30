'use strict';

import should                   from 'should';
import Feedback                 from '../../models/feedback';
import Mungo                    from 'mungo';
import item                     from './item';

should.Assertion.add('feedback', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a Feedback', expected: Feedback };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Feedback);
  }

  this.obj.should.have.property('_id');

  if ( serialized )  {
    this.obj._id.should.be.a.String();
  }
  else {
    this.obj._id.should.be.an.instanceof(Mungo.ObjectID);
  }

  this.obj.should.have.property('item').which.is.an.instanceof(Mungo.ObjectID);

  if ( 'item' in candidate ) {
    this.obj.item.equals(candidate.item._id).should.be.true();
  }

  this.obj.should.have.property('user').which.is.an.instanceof(Mungo.ObjectID);

  if ( 'user' in candidate ) {
    this.obj.user.equals(candidate.user._id).should.be.true();
  }

  this.obj.should.have.property('feedback').which.is.a.String();

  if ( 'feedback' in candidate ) {
    this.obj.feedback.should.be.exactly(candidate.feedback);
  }
});
