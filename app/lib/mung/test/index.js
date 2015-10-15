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
