'use strict';

import should from 'should';
import mongodb from 'mongodb';
import Type from '../../../app/models/type';

should.Assertion.add('typeDocument', function (candidate) {
  this.params = { operator: 'to be a Type', expected: Type };

  this.obj.should.be.an.Object();

  this.obj.should.be.an.instanceof(Type);

  this.obj.should.have.property('_id')
    .which.is.an.instanceof(mongodb.ObjectID);

  this.obj.should.have.property('name').which.is.a.String();

  if ( 'name' in candidate ) {
    this.obj.name.should.be.exactly(candidate.name);
  }
});
