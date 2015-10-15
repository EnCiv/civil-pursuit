'use strict';

import should from 'should';
import Mung from '../';

class Foo extends Mung.Model {

  static schema () {
    return {
      string : String,

      subdocument : {
        type : {
          string : String
        }
      },

      subdocumentInArray : [{
        string : String
      }]
    };
  }

};

const schema = new Foo().__types;

describe ('Parsers', function () {

  describe ( 'Parse empty query' , function () {

    const parsed = Mung.parse({}, schema);

    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

  });

  describe ( 'Parse model version' , function () {

    const parsed = Mung.parse({ __V : 2 }, schema);

    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

    it ( 'should have property __V', function () {

      parsed.should.have.property('__V');

    });

    describe ( '__V' , function () {

      it ( 'should be a number' , function () {

        parsed.__V.should.be.a.Number();

      });

    });

  });

  describe ( 'Parse string' , function () {

    const parsed = Mung.parse({ string : 'foo' }, schema);

    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

    it ( 'should have property string', function () {

      parsed.should.have.property('string');

    });

    describe ( 'string' , function () {

      it ( 'should be a string' , function () {

        parsed.string.should.be.a.String();

      });

    });

  });

  describe ( 'Parse array of subdocuments' , function () {

    const parsed = Mung.parse({ 'subdocumentInArray.string' : 'foo is foo' }, schema);

    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

    it ( 'should have property "subdocumentInArray.string"', function () {

      parsed.should.have.property('subdocumentInArray.string');

    });

    describe ( 'subdocumentInArray.string' , function () {

      it ( 'should be a string' , function () {

        parsed['subdocumentInArray.string'].should.be.a.String();

      });

    });

  });
});
