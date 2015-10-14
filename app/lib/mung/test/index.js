'use strict';

import should from 'should';
import Mung from '../';

class Bar extends Mung.Model {
  static schema () {
    return {
      string : String
    }
  }
}

class Foo extends Mung.Model {}

describe ( 'Mung', function () {

  describe ('Schema', function () {

    const schema = Foo.getSchema();

    it ( 'should be an object', function () {

      schema.should.be.an.Object();

    });

    describe ( '_id', function () {

      it ( 'should exist' , function () {

        schema.should.have.property('_id');

      });

      it ( 'should be an object' , function () {

        schema._id.should.be.an.Object();

      });

      describe ( 'Type' , function () {

        it ( 'should exist' , function () {

          schema._id.should.have.property('type');

        });

        it ( 'should be an ObjectID', function () {

          schema._id.type.should.be.a.Function()
            .which.is.exactly(Mung.ObjectID);

        });

      });

    });

    describe ( '__v (document version)', function () {

      it ( 'should exist' , function () {

        schema.should.have.property('__v');

      });

      it ( 'should be an object' , function () {

        schema.__v.should.be.an.Object();

      });

      describe ( 'Type' , function () {

        it ( 'should exist' , function () {

          schema.__v.should.have.property('type');

        });

        it ( 'should be a Number', function () {

          schema.__v.type.should.be.a.Function()
            .which.is.exactly(Number);

        });

      });

    });

    describe ( '__V (model version)', function () {

      it ( 'should exist' , function () {

        schema.should.have.property('__V');

      });

      it ( 'should be an object' , function () {

        schema.__V.should.be.an.Object();

      });

      describe ( 'Type' , function () {

        it ( 'should exist' , function () {

          schema.__V.should.have.property('type');

        });

        it ( 'should be a Number', function () {

          schema.__V.type.should.be.a.Function()
            .which.is.exactly(Number);

        });

      });

    });

  });

  describe ( 'Type validations' , function () {

    describe( 'Validate String' , function () {

      const string = 'abc';

      const numericString = '1';

      describe ( 'As a String' , function () {

        const validated = Mung.validate2(string, String);

        it ( 'should be true' , function () {

          validated.should.be.true;

        });

      });

      describe ( 'As a Number' , function () {

        const validated = Mung.validate2(string, Number);

        it ( 'should be false' , function () {

          validated.should.be.false;

        });

      });

      describe ( 'As a forced Number' , function () {

        describe ( 'With non-numeric string' , function () {

          const validated = Mung.validate2(string, Number, true);

          it ( 'should be false' , function () {

            validated.should.be.false;

          });

        });

        describe ( 'With a numeric string' , function () {

          const validated = Mung.validate2(numericString, Number, true);

          it ( 'should be true' , function () {

            validated.should.be.true;

          });

        });

      });

    });

    describe( 'Validate Number' , function () {

      const number = 1;

      describe ( 'As a Number' , function () {

        const validated = Mung.validate2(number, Number);

        it ( 'should be true' , function () {

          validated.should.be.true;

        });

      });

      describe ( 'As a String' , function () {

        const validated = Mung.validate2(number, String);

        it ( 'should be false' , function () {

          validated.should.be.false;

        });

      });

      describe ( 'As a forced String' , function () {

        const validated = Mung.validate2(number, String, true);

        it ( 'should be true' , function () {

          validated.should.be.true;

        });

      });

    });

  });

  describe ('Parsers', function () {

    describe ( 'Parse model version' , function () {

      // const parsed = Mung.parse2({ __V : 2 }, Foo.getSchema());
      //
      // it ( 'should be an object', function () {
      //
      //   parsed.should.be.an.Object();
      //
      // });

    });

    // it ('should parse Version', function () {
    //
    //   const parsed = Mung.parse({ __V : 2 }, Foo.getSchema());
    //
    //   parsed
    //     .should.be.an.Object()
    //     .which.have.property('__V')
    //     .which.is.a.Number()
    //     .and.which.is.exactly(2);
    //
    // });

  });

  describe ( 'Convert' , function () {

    describe ( 'Number' , function () {

      describe ( 'to Number' , function () {

        const converted = Mung.convert(123, Number);

        it ( 'should be a number' , function () {

          converted.should.be.a.Number;

        });

      });

      describe ( 'to String' , function () {

        const converted = Mung.convert(123, String);

        it ( 'should be a string' , function () {

          converted.should.be.a.String;

        });

      });

      describe ( 'to Boolean' , function () {

        const converted = Mung.convert(123, Boolean);

        it ( 'should be a boolean' , function () {

          converted.should.be.a.Boolean;

        });

      });

    });

    describe ( 'Array' , function () {

      describe ( 'of full models' , function () {

        const converted = Mung.convert([new Bar({}, { _id : true })], [Bar]);

        console.log(converted);

        it ( 'should be an Array' , function () {

          converted.should.be.an.Array();

        });

        it ( 'should be an Array of ObjectIDs' , function () {

          converted[0].should.be.an.instanceof(Mung.ObjectID);

        });

      });

    });

  });

  describe ('MongoDB Operators', function () {

    describe ('Query operators', function () {

      describe ('Comparison operators', function () {

        describe ('$in', function () {

          it ('should parse $in operator', function () {

            const testers = [
              { type : Number, in : [1, 2, 3] },
              { type : String, in : ['a', 'b', 'c']}
            ];

            testers.forEach(tester => {
              const parsed = Mung.parse(
                { foo : { $in : tester.in } },
                { foo : tester.type }
              );

              console.log(parsed);

              parsed.should.be.an.Object();

              parsed.should.have.property('foo').which.is.an.Object();

              parsed.foo.should.have.property('$in').which.is.an.Array();

              parsed.foo.$in.length.should.be.exactly(tester.in.length);

              tester.in.forEach((item, index) => {
                parsed.foo.$in[index].should.be.a[tester.type.name]();
                parsed.foo.$in[index].should.be.exactly(item);
              });
            });

          });

        });

      });

    });

  });

  describe ('CRUD Operations', function () {

    describe ('Find', function () {

      describe ('Find by ids', function () {

        // it ('should translate to a $in operator', function () {
        //
        //   Mung.findByIds()
        //
        // });

      });

    });

  });

});
