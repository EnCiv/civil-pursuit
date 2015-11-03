'use strict';

import should from 'should';
import Criteria from '../../../app/models/criteria';
import Mungo from 'mungo';

should.Assertion.add('criteria', function (candidate = {}, serialized = false) {
  this.params = { operator: 'to be a Criteria', expected: Criteria };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Criteria);
  }

  this.obj.should.have.property('_id');

  if ( serialized )  {
    this.obj._id.should.be.a.String();
  }
  else {
    this.obj._id.should.be.an.instanceof(Mungo.ObjectID);
  }

  this.obj.should.have.property('name').which.is.a.String();

  if ( 'name' in candidate ) {
    this.obj.name.should.be.exactly(candidate.name);
  }

  this.obj.should.have.property('description').which.is.a.String();

  if ( 'description' in candidate ) {
    this.obj.description.should.be.exactly(candidate.description);
  }
});
