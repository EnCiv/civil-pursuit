'use strict';

import should         from 'should';
import AppError       from '../../models/app-error';
import Mungo          from 'mungo';

should.Assertion.add('appError', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be an AppError', expected: AppError };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(AppError);
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

  this.obj.should.have.property('message').which.is.a.String();

  if ( 'message' in candidate ) {
    this.obj.message.should.be.exactly(candidate.message);
  }

  if ( 'code' in this.obj ) {
    this.obj.should.have.property('code').which.is.a.Number();
  }

  if ( 'code' in candidate ) {
    this.obj.code.should.be.exactly(candidate.code);
  }

  this.obj.should.have.property('stack').which.is.a.String();

  if ( 'stack' in candidate ) {
    this.obj.stack.should.be.exactly(candidate.stack);
  }

  if ( 'debug' in this.obj ) {
    this.obj.should.have.property('debug').which.is.an.Object();
  }

  if ( 'debug' in candidate ) {
    this.obj.debug.should.be.exactly(candidate.debug);
  }

  if ( 'repair' in this.obj ) {
    this.obj.should.have.property('repair').which.is.an.Array();
  }

  if ( 'repair' in candidate ) {
    this.obj.should.have.property('repair').which.is.an.Array();
  }
});
