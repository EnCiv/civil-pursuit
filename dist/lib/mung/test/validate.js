'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('Validate', function () {

  describe('Function', function () {

    describe('String', function () {

      describe('Validate string', function () {

        var validated = _2['default'].validate('abc', String);

        it('should be true', function () {

          validated.should.be['true'];
        });
      });

      describe('Validate converted string', function () {

        var validated = _2['default'].validate('abc', String, true);

        it('should be true', function () {

          validated.should.be['true'];
        });
      });

      describe('Validate number', function () {

        var validated = _2['default'].validate(1, String);

        it('should be false', function () {

          validated.should.be['false'];
        });
      });

      describe('Validate converted number', function () {

        var validated = _2['default'].validate(1, String, true);

        it('should be true', function () {

          validated.should.be['true'];
        });
      });
    });

    describe('Date', function () {

      describe('Date', function () {

        var validated = _2['default'].validate(new Date(), Date);

        it('should be true', function () {

          validated.should.be['true'];
        });
      });

      describe('Timestamp', function () {

        var validated = _2['default'].validate(Date.now(), Date);

        it('should be false', function () {

          validated.should.be['false'];
        });
      });
    });
  });
});