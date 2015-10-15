'use strict';

import should             from 'should';
import Mung               from '../../../app/lib/mung';
import toSlug             from '../../../app/lib/util/to-slug';
import Item               from '../../../app/models/item';
import { Popularity }     from '../../../app/models/item/methods/get-popularity';
import Type               from '../../../app/models/type';
import User               from '../../../app/models/user';
import config             from '../../../public.json';

should.Assertion.add('panelItem', function (item = {}, extra = {}) {
  this.params = { operator: 'to be a panel Item', expected: Object };

  this.obj.should.be.an.Object();

  this.obj.should.have.property('_id').which.is.an.instanceof(Mung.ObjectID);

  this.obj._id.equals(item._id).should.be.true;

  this.obj.should.have.property('id')
    .which.is.a.String()
    .and.is.exactly(item.id);

  this.obj.should.have.property('subject')
    .which.is.a.String()
    .and.is.exactly(item.subject);

  this.obj.should.have.property('description')
    .which.is.a.String()
    .and.is.exactly(item.description);

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
  else {
    this.obj.image.should.be.exactly(config['default item image']);
  }

  this.obj.should.have.property('promotions')
    .which.is.a.Number()
    .and.is.exactly(item.promotions);

    this.obj.should.have.property('views')
      .which.is.a.Number()
      .and.is.exactly(item.views);

  this.obj.should.have.property('popularity')
    .which.is.an.instanceof(Popularity);

  const popularity = item.getPopularity();

  this.obj.popularity.should.have.property('number')
    .which.is.a.Number()
    .and.is.exactly(popularity.number);

  this.obj.popularity.should.have.property('views')
    .which.is.a.Number()
    .and.is.exactly(popularity.views);

  this.obj.popularity.should.have.property('promotions')
    .which.is.a.Number()
    .and.is.exactly(popularity.promotions);

  this.obj.popularity.should.have.property('ok')
    .which.is.a.Boolean()
    .and.is.exactly(popularity.ok);

  this.obj.should.have.property('link')
    .which.is.a.String()
    .and.is.exactly( `/item/${item.id}/${toSlug(item.subject)}`);

  this.obj.should.have.property('lineage')
    .which.is.an.Array();

  extra.lineage.forEach(parent => {
    parent.should.be.an.instanceof(Item);
  });

  this.obj.should.have.property('type')
    .which.is.an.instanceof(Type);

  this.obj.type._id.equals(item.type).should.be.true;
  this.obj.type._id.equals(extra.type._id).should.be.true;

  this.obj.should.have.property('user')
    .which.is.an.Object();

  this.obj.user._id.equals(item.user).should.be.true;
  this.obj.user._id.equals(extra.user._id).should.be.true;

  this.obj.should.have.property('subtype')
    .which.is.an.instanceof(Type);

  this.obj.subtype._id.equals(item.subtype).should.be.true;
  this.obj.subtype._id.equals(extra.subtype._id).should.be.true;

  this.obj.should.have.property('votes')
    .which.is.a.Number();

  this.obj.votes.should.be.exactly(extra.votes);

  this.obj.should.have.property('children')
    .which.is.a.Number()
    .and.which.is.exactly(extra.children);

  this.obj.should.have.property('harmony')
    .which.is.an.Object();

  this.obj.harmony.should.have.property('pro')
    .which.is.exactly(extra.harmony.pro);

  this.obj.harmony.should.have.property('con')
    .which.is.exactly(extra.harmony.con);

  this.obj.harmony.should.have.property('harmony')
    .which.is.exactly(extra.harmony.harmony);

});
