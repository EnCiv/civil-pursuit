'use strict';

import should                 from 'should';
import Employment             from '../../models/employment';
import Mungo                  from 'mungo';

should.Assertion.add('employment', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a Employment', expected: Employment };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Employment);
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
});
