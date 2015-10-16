'use strict';

import should from 'should';
import Mung from '../';

describe ( 'Validate' , function () {

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
