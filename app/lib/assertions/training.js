'use strict';

import should               from 'should';
import Training             from '../../models/training';
import Mungo                from 'mungo';

should.Assertion.add('instruction', function (candidate = {}, serialized = false) {
  this.params = { operator: 'to be a Training', expected: Training };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Training);
  }

  this.obj.should.have.property('_id');

  if ( serialized )  {
    this.obj._id.should.be.a.String();
  }
  else {
    this.obj._id.should.be.an.instanceof(Mungo.ObjectID);
  }

  this.obj.should.have.property('element').which.is.a.String();

  if ( 'element' in candidate ) {
    this.obj.element.should.be.exactly(candidate.element);
  }

  this.obj.should.have.property('title').which.is.a.String();

  if ( 'title' in candidate ) {
    this.obj.title.should.be.exactly(candidate.title);
  }

  this.obj.should.have.property('description').which.is.a.String();

  if ( 'description' in candidate ) {
    this.obj.description.should.be.exactly(candidate.description);
  }

  this.obj.should.have.property('step').which.is.a.Number();

  if ( 'step' in candidate ) {
    this.obj.step.should.be.exactly(candidate.step);
  }

  if ( 'in' in this.obj ) {
    this.obj.in.should.be.a.Boolean();
  }

  if ( 'click' in this.obj ) {
    this.obj.click.should.be.a.String();
  }

});
