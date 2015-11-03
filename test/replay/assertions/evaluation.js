'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import isCriteria           from './criteria';
import { Evaluation }       from '../../../app/lib/app/evaluate';
import Type                 from '../../../app/models/type';

should.Assertion.add('evaluation', function (candidate = {}, serialized = false) {
  this.params = { operator: 'to be an Evaluation', expected: Evaluation };

  this.obj.should.be.an.Object();

  if ( ! serialized ) {
    this.obj.should.be.an.instanceof(Evaluation);
  }

  this.obj.should.have.property('split')
    .which.is.a.Boolean();

  if ( 'split' in candidate ) {
    this.obj.split.should.be.exactly(candidate.split);
  }

  this.obj.should.have.property('type')
    .which.is.a.typeDocument();

  if ( 'type' in candidate ) {
    this.obj.type.should.be.a.typeDocument(candidate.type);
  }

  this.obj.should.have.property('item')
    .which.is.an.instanceof(Mungo.ObjectID);

  if ( 'item' in candidate ) {
    this.obj.item.equals(candidate.item).should.be.true;
  }

  this.obj.should.have.property('items')
    .which.is.an.Array();

  this.obj.items.forEach(item => item.should.be.a.panelItem());

  this.obj.should.have.property('criterias')
    .which.is.an.Array();

  this.obj.criterias.forEach(item => item.should.be.a.criteria());

  this.obj.should.have.property('position')
    .which.is.a.String();

  try {
    this.obj.position.should.be.exactly('first');
  }
  catch ( error ) {
    this.obj.position.should.be.exactly('last');
  }

});
