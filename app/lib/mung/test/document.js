'use strict';

import should from 'should';
import Mung from '../';
import { Foo, Bar } from './model';

describe ('Document', function () {

  const document = new Foo({});

  console.log(require('util').inspect(document.__types, { depth: 15 }));

  console.log('---------------------------------------------------------------')

  console.log(require('util').inspect(document.__refs, { depth: 15 }));

  console.log('---------------------------------------------------------------')

  console.log('flatten', Mung.flatten(new Foo({ bar : Mung.ObjectID() }).toJSON()));

  // console.log('resolved', Mung.resolve('C.F.G.H', flatten))

  describe ( 'Type', function () {

    it ( 'should be correct' , function () {

      document.should.have.property('__types');

      const { __types } = document;

      __types.should.have.property('string').which.is.exactly(String);
      __types.should.have.property('number').which.is.exactly(Number);
      __types.should.have.property('boolean').which.is.exactly(Boolean);
      __types.should.have.property('object').which.is.exactly(Object);
      __types.should.have.property('date').which.is.exactly(Date);
      __types.should.have.property('regex').which.is.exactly(RegExp);
      __types.should.have.property('error').which.is.exactly(Error);
      __types.should.have.property('bar').which.is.exactly(Bar);
      __types.should.have.property('mixed').which.is.exactly(Mung.Mixed);
      __types.should.have.property('objectid').which.is.exactly(Mung.ObjectID);
      __types.should.have.property('hex').which.is.exactly(Mung.Hex);
      __types.should.have.property('octal').which.is.exactly(Mung.Octal);
      __types.should.have.property('binary').which.is.exactly(Mung.Binary);
      __types.should.have.property('location').which.is.exactly(Mung.Location);

      __types.should.have.property('strings')
        .which.is.an.Array().and.have.length(1);
      __types.strings[0].should.be.exactly(String);

      __types.should.have.property('subdocument')
        .which.is.an.Object()
        .and.have.property('string')
        .which.is.exactly(String);

      __types.should.have.property('subdocuments')
        .which.is.an.Array().and.have.length(1);
      __types.subdocuments[0].should.be.an.Object()
        .and.have.property('string').which.is.exactly(String);

      __types.should.have.property('embeddedSubdocuments')
        .which.is.an.Object()
        .and.have.property('subdocument')
        .which.is.an.Object()
        .and.have.property('string')
        .which.is.exactly(String);

    });

  });
});
