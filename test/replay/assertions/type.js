'use strict';

import should from 'should';
import Type from '../../../app/models/type';
import Mung from '../../../app/lib/mung';

should.Assertion.add('typeDocument', function (candidate = {}, extra = {}) {
  this.params = { operator: 'to be a Type', expected: Type };

  this.obj.should.be.an.Object();

  if ( ! extra.json ) {
    this.obj.should.be.an.instanceof(Type);
  }

  this.obj.should.have.property('_id');

  if ( extra.json )  {
    this.obj._id.should.be.a.String();
  }
  else {
    this.obj._id.should.be.an.instanceof(Mung.ObjectID);
  }

  this.obj.should.have.property('name').which.is.a.String();

  if ( 'name' in candidate ) {
    this.obj.name.should.be.exactly(candidate.name);
  }
});
