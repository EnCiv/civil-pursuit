'use strict';

import should         from 'should';
import Config         from '../../models/config';
import Mungo          from 'mungo';

should.Assertion.add('config', function (candidate = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a config', expected: Config };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Config);
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

  this.obj.should.have.property('value');

  if ( 'value' in candidate ) {
    this.obj.value.should.be.exactly(candidate.value);
  }
});
