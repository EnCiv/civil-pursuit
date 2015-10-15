'use strict';

import should from 'should';
import Mung from '../';

class Foo extends Mung.Model {};

describe ('Schema', function () {

  const schema = Foo.getSchema();

  it ( 'should be an object', function () {

    schema.should.be.an.Object();

  });

  describe ( '_id', function () {

    it ( 'should exist' , function () {

      schema.should.have.property('_id');

    });

    it ( 'should be ObjectID' , function () {

      schema._id.should.be.exactly(Mung.ObjectID);

    });

  });

  describe ( '__v (document version)', function () {

    it ( 'should exist' , function () {

      schema.should.have.property('__v');

    });

    it ( 'should be Number' , function () {

      schema.__v.should.be.exactly(Number);

    });
  });

  describe ( '__V (model version)', function () {

    it ( 'should exist' , function () {

      schema.should.have.property('__V');

    });

    it ( 'should be Number' , function () {

      schema.__V.should.be.exactly(Number);

    });

  });

});
