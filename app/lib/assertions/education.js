'use strict';

import should                 from 'should';
import Education              from '../../models/education';
import Mungo                  from 'mungo';

should.Assertion.add('education', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a Education', expected: Education };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Education);
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
