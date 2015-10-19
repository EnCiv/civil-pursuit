'use strict';

import should from 'should';
import Mung from '../';

describe ( 'Validate' , function () {

  describe ( 'Function', function () {

    describe ( 'String' , function () {

      describe ( 'Validate string' , function () {

        const validated = Mung.validate('abc', String);

        it ( 'should be true', function () {

          validated.should.be.true;

        });

      });

      describe ( 'Validate converted string' , function () {

        const validated = Mung.validate('abc', String, true);

        it ( 'should be true', function () {

          validated.should.be.true;

        });

      });

      describe ( 'Validate number' , function () {

        const validated = Mung.validate(1, String);

        it ( 'should be false', function () {

          validated.should.be.false;

        });

      });

      describe ( 'Validate converted number' , function () {

        const validated = Mung.validate(1, String, true);

        it ( 'should be true', function () {

          validated.should.be.true;

        });

      });

    });

    describe ( 'Date', function () {

      describe ( 'Date', function () {

        const validated = Mung.validate(new Date(), Date);

        it ( 'should be true', function () {

          validated.should.be.true;

        });

      });

      describe ( 'Timestamp', function () {

        const validated = Mung.validate(Date.now(), Date);

        it ( 'should be false', function () {

          validated.should.be.false;

        });

      });

    });


  });

});
