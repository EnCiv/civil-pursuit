'use strict';

import should             from 'should';
import Mungo              from 'mungo';
import toSlug             from '../util/to-slug';
import Item               from '../../models/item';
import { Popularity }     from '../../models/item/methods/get-popularity';
import Type               from '../../models/type';
import User               from '../../models/user';

should.Assertion.add('panelItem', function (item = {}, extra = {}, serialized = false) {
  this.params = { operator: 'to be a panel Item', expected: Object };

  this.obj.should.be.an.Object();

  this.obj.should.have.property('_id');

  if ( serialized ) {
    Mungo.ObjectID.convert(this.obj._id).should.be.an.instanceof(Mungo.ObjectID);
  }
  else {
    this.obj._id.should.be.an.instanceof(Mungo.ObjectID);
    this.obj._id.equals(item._id).should.be.true;
  }

  this.obj.should.have.property('id')
    .which.is.a.String();

  if ( 'id' in item ) {
    this.obj.id.should.be.exactly(item.id);
  }

  this.obj.should.have.property('subject')
    .which.is.a.String();

  if ( 'subject' in item ) {
    this.obj.subject.should.be.exactly(item.subject);
  }

  this.obj.should.have.property('description')
    .which.is.a.String();

  if ( 'description' in item ) {
    this.obj.description.should.be.exactly(item.description);
  }

  if ( item.references ) {
    this.obj.should.have.property('references')
      .which.is.an.Array();

    item.references.forEach((reference, index) => {
      this.obj.references[index].should.be.an.Object();

      this.obj.references[index].should.have.property('url')
        .which.is.a.String()
        .and.is.exactly(reference.url);

      if ( 'title' in reference ) {
        this.obj.references[index].should.have.property('title')
          .which.is.a.String()
          .and.is.exactly(reference.title);
      }
    });
  }

  this.obj.should.have.property('image')
    .which.is.a.String();

  if ( 'image' in item ) {
    this.obj.image.should.be.exactly(item.image);
  }

  this.obj.should.have.property('promotions')
    .which.is.a.Number();

  if ( 'promotions' in item ) {
    this.obj.promotions.should.be.exactly(item.promotions);
  }

  this.obj.should.have.property('views')
    .which.is.a.Number();

  if ( 'views' in item ) {
    this.obj.views.should.be.exactly(item.views);
  }

  this.obj.should.have.property('popularity');

  if ( serialized ) {
    this.obj.popularity.should.be.an.Object();
  }
  else {
    this.obj.popularity.should.be.an.instanceof(Popularity);
  }

  this.obj.popularity.should.have.property('number')
    .which.is.a.Number();

  if ( item instanceof Item ) {
    const popularity = item.getPopularity();

    this.obj.popularity.number.should.be.exactly(popularity.number);

    this.obj.popularity.should.have.property('views')
      .which.is.a.Number()
      .and.is.exactly(popularity.views);

    this.obj.popularity.should.have.property('promotions')
      .which.is.a.Number()
      .and.is.exactly(popularity.promotions);

    this.obj.popularity.should.have.property('ok')
      .which.is.a.Boolean()
      .and.is.exactly(popularity.ok);
  }

  this.obj.should.have.property('link')
    .which.is.a.String();

  if ( item instanceof Item ) {
    this.obj.link.should.be.exactly( `/item/${item.id}/${toSlug(item.subject)}`);
  }

  this.obj.should.have.property('lineage')
    .which.is.an.Array();

  if ( 'lineage' in extra ) {
    extra.lineage.forEach(parent => {
      parent.should.be.an.instanceof(Item);
    });
  }

  this.obj.should.have.property('type');

  if ( serialized ) {
    this.obj.type.should.be.an.Object()
      .and.have.property('_id');
  }
  else {
    this.obj.type.should.be.a.typeDocument();
  }

  if ( 'type' in item ) {
    this.obj.type._id.equals(item.type).should.be.true;
  }

  if ( 'type' in extra ) {
    this.obj.type._id.equals(extra.type._id).should.be.true;
  }

  this.obj.should.have.property('user')
    .which.is.an.Object();

  if ( 'user' in item ) {
    this.obj.user._id.equals(item.user).should.be.true;
  }

  if ( 'user' in extra ) {
    this.obj.user._id.equals(extra.user._id).should.be.true;
  }

  if ( this.obj.subtype ) {
    this.obj.should.have.property('subtype');

    if ( serialized ) {
      this.obj.subtype.should.be.an.Object()
        .and.have.property('_id');
    }
    else {
      this.obj.subtype.should.be.an.instanceof(Type);
    }
  }

  if ( extra.subtype ) {
    this.obj.subtype._id
      .equals(extra.subtype._id).should.be.true;
  }

  this.obj.should.have.property('votes')
    .which.is.a.Number();

  if ( 'votes' in extra ) {
    this.obj.votes.should.be.exactly(extra.votes);
  }

  this.obj.should.have.property('children')
    .which.is.a.Number()

  if ( 'children' in extra ) {
    this.obj.children.should.be.exactly(extra.children);
  }

  this.obj.should.have.property('harmony')
    .which.is.an.Object();

  if ( ! serialized ) {
    this.obj.harmony.should.have.property('pro');
  }

  if ( extra.harmony && 'pro' in extra.harmony ) {
    should(this.obj.harmony.pro).be.exactly(extra.harmony.pro);
  }

  if ( ! serialized ) {
    this.obj.harmony.should.have.property('con');
  }

  if ( extra.harmony && 'con' in extra.harmony ) {
    should(this.obj.harmony.con).be.exactly(extra.harmony.con);
  }

  this.obj.harmony.should.have.property('harmony');

  if ( 'harmony' in extra ) {
    this.obj.harmony.harmony.should.be.exactly(extra.harmony.harmony);
  }

});
