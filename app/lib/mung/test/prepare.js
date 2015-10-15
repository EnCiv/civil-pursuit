'use strict';

import should from 'should';
import Mung from '../';

class Foo1 extends Mung.Model {

  static schema () {
    return {
      string : {
        default : 'hello'
      },
      number : {
        default : 0
      },
      date : {
        default : Date.now
      },
      mixed : {
        type : [Mung.Mixed],
        default : []
      },
      array : [{
        foo : {
          type : String,
          default : 'hello'
        }
      }],
      subdocument : {
        type : {
          foo : {
            type : String,
            default : 'hello'
          },
          bar : {
            type : {
              barz : {
                type : Number,
                default : 1
              }
            }
          }
        }
      }
    };
  }

}

describe ('Prepare', function () {

  describe ( 'Prepare empty query', function () {

    const document = new Foo1({});

    it ( 'should prepare document for insertion' , function (done) {

      document.prepare('insert').then(() => done(), done);

    });

    describe ( 'Document', function () {

      it ( 'should have a string property' , function () {

        document.should.have.property('string');

      });

      describe ( 'string' , function () {

        it ( 'should say hello' , function () {

          document.string.should.be.exactly('hello');

        });

      });

    });

  });

});
