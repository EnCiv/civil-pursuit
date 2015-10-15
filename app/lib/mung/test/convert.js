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
