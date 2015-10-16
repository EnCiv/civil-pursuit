'use strict';

import should from 'should';
import Mung from '../';

describe ('MongoDB Operators', function () {

  describe ('Query operators', function () {

    describe ('Comparison operators', function () {

      describe ('$in', function () {

        let parsed = Mung.parse({ foo : { $in : [1 , '2'] }}, { foo : Number });

        it ( 'should be an object' , function () {

          parsed.should.be.an.Object();

        });

        it ( 'should have property "foo"', function () {

          parsed.should.have.property('foo');

        });

        describe ( 'foo' , function  () {

          it ( 'should be an object' , function () {

            parsed.foo.should.be.an.Object();

          });

          it ( 'should have property "$in"', function () {

            parsed.foo.should.have.property('$in');

          });

          describe ( '$in' , function  () {

            it ( 'should be an array' , function () {

              parsed.foo.$in.should.be.an.Array();

            });

            it ( 'should have the right length', function () {

              parsed.foo.$in.should.have.length(2);

            });

            it ( 'should have the right item', function () {

              parsed.foo.$in[0].should.be.a.Number().and.is.exactly(1);
              parsed.foo.$in[1].should.be.a.Number().and.is.exactly(2);

            });

          });

        });

      });

      describe ('$exists', function () {

        let parsed = Mung.parse({ foo : { $exists : true }}, { foo : Number });

        it ( 'should be an object' , function () {

          parsed.should.be.an.Object();

        });

        it ( 'should have property "foo"', function () {

          parsed.should.have.property('foo');

        });

        describe ( 'foo' , function  () {

          it ( 'should be an object' , function () {

            parsed.foo.should.be.an.Object();

          });

          it ( 'should have property "$exists"', function () {

            parsed.foo.should.have.property('$exists');

          });

          describe ( '$exists' , function  () {

            it ( 'should be an boolean' , function () {

              parsed.foo.$exists.should.be.a.Boolean();

            });

            it ( 'should have the right value', function () {

              parsed.foo.$exists.should.be.true;

            });

          });

        });

      });

      describe ('$lt', function () {

        let parsed = Mung.parse({ number : { $lt : 2 } }, { number : Number });

        it ( 'should be an object' , function () {

          parsed.should.be.an.Object();

        });

        it ( 'should have property "number"', function () {

          parsed.should.have.property('number');

        });

        describe ( 'number' , function  () {

          it ( 'should be an object' , function () {

            parsed.number.should.be.an.Object();

          });

          it ( 'should have property "$lt"', function () {

            parsed.number.should.have.property('$lt');

          });

          describe ( '$lt' , function  () {

            it ( 'should be an number' , function () {

              parsed.number.$lt.should.be.a.Number();

            });

            it ( 'should be 2 ', function () {

              parsed.number.$lt.should.be.exactly(2);

            });

          });

        });

      });

      describe ('$size', function () {

        let parsed = Mung.parse({ numbers : { $size : 2 } }, { numbers : [Number] });

        it ( 'should be an object' , function () {

          parsed.should.be.an.Object();

        });

        it ( 'should have property "numbers"', function () {

          parsed.should.have.property('numbers');

        });

        describe ( 'numbers' , function  () {

          it ( 'should be an object' , function () {

            parsed.numbers.should.be.an.Object();

          });

          it ( 'should have property "$size"', function () {

            parsed.numbers.should.have.property('$size');

          });

          describe ( '$size' , function  () {

            it ( 'should be an numbers' , function () {

              parsed.numbers.$size.should.be.a.Number();

            });

            it ( 'should be 2 ', function () {

              parsed.numbers.$size.should.be.exactly(2);

            });

          });

        });

      });


      describe ( '$not' , function () {

        let parsed = Mung.parse({ number : { $not : { $exists : true } } },
          { number : Number });


        it ( 'should be an object', function () {

          parsed.should.be.an.Object();

        });

        it ( 'should have property number', function () {

          parsed.should.have.property('number');

        });

        describe ( 'number' , function () {

          it ( 'should be an object' , function () {

            parsed.number.should.be.an.Object();

          });

          it ( 'should have property $not', function () {

            parsed.number.should.have.property('$not');

          });

          describe ( '$not' , function () {

            it ( 'should be an object' , function () {

              parsed.number.$not.should.be.an.Object();

            });

            it ( 'should have property $exists', function () {

              parsed.number.$not.should.have.property('$exists');

            });

            describe ( '$exists' , function () {

              it ( 'should be true' , function () {

                parsed.number.$not.$exists.should.be.true;

              });

            });

          });

        });

      });

    });

  });

});
