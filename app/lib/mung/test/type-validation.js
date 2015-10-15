'use strict';

import should from 'should';
import Mung from '../';

describe ( 'Type validations' , function () {

  describe( 'Validate String' , function () {

    const string = 'abc';

    const numericString = '1';

    describe ( 'As a String' , function () {

      const validated = Mung.validate(string, String);

      it ( 'should be true' , function () {

        validated.should.be.true;

      });

    });

    describe ( 'As a Number' , function () {

      const validated = Mung.validate(string, Number);

      it ( 'should be false' , function () {

        validated.should.be.false;

      });

    });

    describe ( 'As a forced Number' , function () {

      describe ( 'With non-numeric string' , function () {

        const validated = Mung.validate(string, Number, true);

        it ( 'should be false' , function () {

          validated.should.be.false;

        });

      });

      describe ( 'With a numeric string' , function () {

        const validated = Mung.validate(numericString, Number, true);

        it ( 'should be true' , function () {

          validated.should.be.true;

        });

      });

    });

  });

  describe( 'Validate Number' , function () {

    const number = 1;

    describe ( 'As a Number' , function () {

      const validated = Mung.validate(number, Number);

      it ( 'should be true' , function () {

        validated.should.be.true;

      });

    });

    describe ( 'As a String' , function () {

      const validated = Mung.validate(number, String);

      it ( 'should be false' , function () {

        validated.should.be.false;

      });

    });

    describe ( 'As a forced String' , function () {

      const validated = Mung.validate(number, String, true);

      it ( 'should be true' , function () {

        validated.should.be.true;

      });

    });

  });

});
