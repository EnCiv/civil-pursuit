'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('Type validations', function () {

  describe('Validate String', function () {

    var string = 'abc';

    var numericString = '1';

    describe('As a String', function () {

      var validated = _2['default'].validate(string, String);

      it('should be true', function () {

        validated.should.be['true'];
      });
    });

    describe('As a Number', function () {

      var validated = _2['default'].validate(string, Number);

      it('should be false', function () {

        validated.should.be['false'];
      });
    });

    describe('As a forced Number', function () {

      describe('With non-numeric string', function () {

        var validated = _2['default'].validate(string, Number, true);

        it('should be false', function () {

          validated.should.be['false'];
        });
      });

      describe('With a numeric string', function () {

        var validated = _2['default'].validate(numericString, Number, true);

        it('should be true', function () {

          validated.should.be['true'];
        });
      });
    });
  });

  describe('Validate Number', function () {

    var number = 1;

    describe('As a Number', function () {

      var validated = _2['default'].validate(number, Number);

      it('should be true', function () {

        validated.should.be['true'];
      });
    });

    describe('As a String', function () {

      var validated = _2['default'].validate(number, String);

      it('should be false', function () {

        validated.should.be['false'];
      });
    });

    describe('As a forced String', function () {

      var validated = _2['default'].validate(number, String, true);

      it('should be true', function () {

        validated.should.be['true'];
      });
    });
  });
});