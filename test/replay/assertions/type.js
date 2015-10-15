'use strict';

import should from 'should';
import Type from '../../../app/models/type';
import Mung from '../../../app/lib/mung';

should.Assertion.add('typeDocument', function (candidate) {
  this.params = { operator: 'to be a Type', expected: Type };

  this.obj.should.be.an.Object();

  this.obj.should.be.an.instanceof(Type);

  this.obj.should.have.property('_id')
    .which.is.an.instanceof(Mung.ObjectID);

  this.obj.should.have.property('name').which.is.a.String();

  if ( 'name' in candidate ) {
    this.obj.name.should.be.exactly(candidate.name);
  }
});
