'use strict';

import should from 'should';
import Mung from '../';

class Foo extends Mung.Model {

}

describe ( 'Mung', function () {

  describe ('Schema', function () {

    it ( 'should have a version' , function () {

      const schema = Foo.getSchema();

      schema.should.be.an.Object();

      schema.should.have.property('_id')
        .which.is.a.Function();

      schema._id.name.should.be.exactly('ObjectID');

      schema.should.have.property('__v')
        .which.is.a.Function();

      schema.__v.name.should.be.exactly('Number');

      schema.should.have.property('__V')
        .which.is.a.Function();

      schema.__V.name.should.be.exactly('Number');

    });

  });

  describe ('Parsers', function () {

    it ('should parse Version', function () {

      const parsed = Mung.parse({ __V : 2 }, Foo.getSchema());

      parsed
        .should.be.an.Object()
        .which.have.property('__V')
        .which.is.a.Number()
        .and.which.is.exactly(2);

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
