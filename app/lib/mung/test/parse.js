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

  describe ( 'Parse id' , function () {

    const parsed = Mung.parse({ _id : Mung.ObjectID() }, schema);

    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

    it ( 'should have property _id', function () {

      parsed.should.have.property('_id');

    });

    describe ( '_id' , function () {

      it ( 'should be an ObjctID' , function () {

        parsed._id.should.be.an.instanceof(Mung.ObjectID);

      });

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

  describe ( 'Parse array meaning or' , function () {

    const parsed = Mung.parse([ { number : 1 }, { number : 2 } ], { number : Number });


    it ( 'should be an object', function () {

      parsed.should.be.an.Object();

    });

    it ( 'should have property "$or"', function () {

      parsed.should.have.property('$or');

    });

    describe ( '$or' , function () {

      it ( 'should be an array' , function () {

        parsed.$or.should.be.an.Array();

      });

      describe ( 'Array', function () {

        it ( 'should have 2 items' , function () {

          parsed.$or.should.have.length(2);

        });

        describe ( '1st item' , function () {

          it ( 'should be an object' , function () {

            parsed.$or[0].should.be.an.Object();

          });

          describe ( 'Object' , function () {

            it ( 'should have property number' , function () {

              parsed.$or[0].should.have.property('number');

            });

            describe ( 'Number' , function () {

              it ( 'should be 1' , function () {

                parsed.$or[0].number.should.be.exactly(1);

              });

            });

          });

        });

        describe ( '2nd item' , function () {

          it ( 'should be an object' , function () {

            parsed.$or[1].should.be.an.Object();

          });

          describe ( 'Object' , function () {

            it ( 'should have property number' , function () {

              parsed.$or[1].should.have.property('number');

            });

            describe ( 'Number' , function () {

              it ( 'should be 2' , function () {

                parsed.$or[1].number.should.be.exactly(2);

              });

            });

          });

        });

      });

    });

  });

  describe ( 'Parse array with or' , function () {

    const parsed = Mung.parse([ { string : 'a', numbers : 2 } ], {
      string : String,
      numbers : [Number]
    });

    console.log(require('util').inspect(parsed, { depth: null }));

  });
});
