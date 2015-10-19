'use strict';

import should from 'should';
import Mung from '../';

describe ('MongoDB Operators', function () {

  describe ('Query operators', function () {

    describe ('Comparison operators', function () {

      describe ( '$eq' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $eq : '2' } },
          { number : Number }
        );

        it ( 'should have parsed $eq', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$eq')
            .which.is.exactly(2);

        });

      });

      describe ( '$gt' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $gte : '2' } },
          { number : Number }
        );

        it ( 'should have parsed $gte', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$gte')
            .which.is.exactly(2);

        });

      });

      describe ( '$lt' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $lt : '2' } },
          { number : Number }
        );

        it ( 'should have parsed $lt', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$lt')
            .which.is.exactly(2);

        });

      });

      describe ( '$lte', function () {

        const parsed = Mung.parseFindQuery(
          { date : { $lte : Date.now() } },
          { date : Date }
        );

        it ( 'should have parsed $lte', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('date')
            .which.is.an.Object()
            .and.have.property('$lte')
            .which.is.an.instanceof(Date);

        });

      });

      describe ( '$ne' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $ne : '2' } },
          { number : Number }
        );

        it ( 'should have parsed $ne', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$ne')
            .which.is.exactly(2);

        });

      });

      describe ( '$in' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $in : ['2', true] } },
          { number : Number }
        );

        it ( 'should have parsed $in', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$in')
            .which.is.an.Array()
            .and.have.length(2);

          parsed
            .number
            .$in[0]
            .should.be.exactly(2);

            parsed
              .number
              .$in[1]
              .should.be.exactly(1);

        });

      });

      describe ( '$nin' , function () {

        const parsed = Mung.parseFindQuery(
          { number : { $nin : ['2', true] } },
          { number : Number }
        );

        it ( 'should have parsed $nin', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.an.Object()
            .and.have.property('$nin')
            .which.is.an.Array()
            .and.have.length(2);

          parsed
            .number
            .$nin[0]
            .should.be.exactly(2);

            parsed
              .number
              .$nin[1]
              .should.be.exactly(1);

        });

      });

      describe ( '$or' , function () {

        const parsed = Mung.parseFindQuery(
          { $or : [ { number : 1 } , { number : false } ] },
          { number : Number }
        );

        it ( 'should have parsed $or', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('$or')
            .which.is.an.Array()
            .and.have.length(2);

          parsed
            .$or[0]
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.exactly(1);

            parsed
              .$or[1]
              .should.be.an.Object()
              .and.have.property('number')
              .which.is.exactly(0);

        });

      });

      describe ( '$and' , function () {

        const parsed = Mung.parseFindQuery(
          { $and : [ { number : 1 } , { number : false } ] },
          { number : Number }
        );

        it ( 'should have parsed $and', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('$and')
            .which.is.an.Array()
            .and.have.length(2);

          parsed
            .$and[0]
            .should.be.an.Object()
            .and.have.property('number')
            .which.is.exactly(1);

            parsed
              .$and[1]
              .should.be.an.Object()
              .and.have.property('number')
              .which.is.exactly(0);

        });

      });

      describe ( '$not', function () {

        const parsed = Mung.parseFindQuery(
          { price: { $not: { $gt: 1.99 } } },
          { price : Number }
        );

        it ( 'should have parsed $not', function () {

          parsed
            .should.be.an.Object()
            .and.have.property('price')
            .which.is.an.Object()
            .and.have.property('$not')
            .which.is.an.Object()
            .and.have.property('$gt')
            .which.is.exactly(1.99);

        });

      });

      describe ( '$nor' , function () {

        const parsed = Mung.parseFindQuery(
          { $nor: [ { price: 1.99 }, { sale: 1 } ] },
          { price : Number, sale : Boolean }
        );

        it ( 'should have parsed $nor' , function () {

          parsed
            .should.be.an.Object()
            .which.have.property('$nor')
            .which.is.an.Array();

          parsed
            .$nor[0]
            .should.be.an.Object()
            .and.have.property('price')
            .which.is.exactly(1.99);

            parsed
              .$nor[1]
              .should.be.an.Object()
              .and.have.property('sale')
              .which.is.exactly(true);

        });

      });

    });

  });

});
