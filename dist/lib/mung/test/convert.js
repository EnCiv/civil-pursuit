'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Bar = (function (_Mung$Model) {
  function Bar() {
    _classCallCheck(this, Bar);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Bar, _Mung$Model);

  _createClass(Bar, null, [{
    key: 'schema',
    value: function schema() {
      return {
        string: String
      };
    }
  }]);

  return Bar;
})(_2['default'].Model);

describe('Convert', function () {

  describe('<Number>', function () {

    describe('{Number}', function () {

      describe('Integer', function () {

        describe('Positive', function () {

          var converted = _2['default'].convert(123, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a 123', function () {

            converted.should.be.exactly(123);
          });
        });

        describe('Negative', function () {

          var converted = _2['default'].convert(-123, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a -123', function () {

            converted.should.be.exactly(-123);
          });
        });
      });

      describe('Float', function () {

        describe('Positive', function () {

          var converted = _2['default'].convert(1.99, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a 1.99', function () {

            converted.should.be.exactly(1.99);
          });
        });

        describe('Negative', function () {

          var converted = _2['default'].convert(-1.99, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a -1.99', function () {

            converted.should.be.exactly(-1.99);
          });
        });
      });

      describe('Big number', function () {

        describe('Big', function () {

          var converted = _2['default'].convert(4200000000000000000, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a 42e17', function () {

            converted.should.be.exactly(4200000000000000000);
          });
        });

        describe('Small', function () {

          var converted = _2['default'].convert(0.000042, Number);

          it('should be a number', function () {

            converted.should.be.a.Number();
          });

          it('should be a 42e-6', function () {

            converted.should.be.exactly(0.000042);
          });
        });
      });

      describe('Precision', function () {

        var converted = _2['default'].convert(1.023616785, Number);

        it('should be a number', function () {

          converted.should.be.a.Number();
        });

        it('should be a 1.023616785', function () {

          converted.should.be.exactly(1.023616785);
        });
      });
    });

    describe('{String}', function () {

      describe('numeric string', function () {

        var converted = _2['default'].convert('123', Number);

        it('should be a number', function () {

          converted.should.be.a.Number();
        });

        it('should be a 123', function () {

          converted.should.be.exactly(123);
        });
      });

      describe('non-numeric string', function () {

        it('should be throw an error', function () {

          (function () {
            _2['default'].convert('hello', Number);
          }).should['throw'](_2['default'].Error);
        });
      });
    });

    describe('{Boolean}', function () {

      describe('true', function () {

        var converted = _2['default'].convert(true, Number);

        it('should be a boolean', function () {

          converted.should.be.a.Number();
        });

        it('should be a 1', function () {

          converted.should.be.exactly(1);
        });
      });

      describe('false', function () {

        var converted = _2['default'].convert(false, Number);

        it('should be a boolean', function () {

          converted.should.be.a.Number();
        });

        it('should be a 0', function () {

          converted.should.be.exactly(0);
        });
      });
    });

    describe('{Date}', function () {

      var converted = _2['default'].convert(new Date(), Number);

      it('should be a number', function () {

        converted.should.be.a.Number();
      });

      it('should be a timestamp', function () {

        (Date.now() - converted < 10).should.be['true'];
      });
    });

    describe('{null}', function () {

      var converted = _2['default'].convert(null, Number);

      it('should be a number', function () {

        converted.should.be.a.Number();
      });

      it('should be 0', function () {

        converted.should.be.exactly(0);
      });
    });

    describe('{undefined}', function () {

      it('should throw error', function () {

        (function () {
          _2['default'].convert(undefined, Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Array}', function () {

      var converted = _2['default'].convert([], Number);

      it('should be a number', function () {

        converted.should.be.a.Number();
      });

      it('should be 0', function () {

        converted.should.be.exactly(0);
      });
    });

    describe('{Object}', function () {

      it('should throw error', function () {

        (function () {
          _2['default'].convert({}, Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Infinity}', function () {

      describe('Infinity', function () {

        it('should throw error', function () {

          (function () {
            _2['default'].convert(Infinity, Number);
          }).should['throw'](_2['default'].Error);
        });
      });

      describe('-Infinity', function () {

        it('should throw error', function () {

          (function () {
            _2['default'].convert(-Infinity, Number);
          }).should['throw'](_2['default'].Error);
        });
      });
    });

    describe('{Octal}', function () {

      var converted = _2['default'].convert(420, Number);

      it('should be a number', function () {
        converted.should.be.a.Number();
      });

      it('should be 420', function () {
        converted.should.be.exactly(420);
      });
    });

    describe('{Decimal}', function () {

      var converted = _2['default'].convert(15985, Number);

      it('should be a number', function () {
        converted.should.be.a.Number();
      });

      it('should be 15985', function () {
        converted.should.be.exactly(15985);
      });
    });

    describe('{Symbol}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(Symbol(1), Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Function}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(Function, Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Buffer}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(new Buffer(123), Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Binary}', function () {

      var converted = _2['default'].convert(3, Number);

      it('should be a number', function () {

        converted.should.be.a.Number();
      });

      it('should be 3', function () {

        converted.should.be.exactly(3);
      });

      describe('base 2', function () {

        var base2 = _2['default'].convert(3, Number);

        it('should be a number', function () {

          base2.should.be.a.Number();
        });

        it('should be 3', function () {

          converted.should.be.exactly(3);
        });
      });
    });

    describe('{Model}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(new _2['default'].Model(), Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{ObjectID}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(_2['default'].ObjectID(), Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Regex}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(/abc/, Number);
        }).should['throw'](_2['default'].Error);
      });
    });

    describe('{Error}', function () {

      it('should throw an eror', function () {
        (function () {
          _2['default'].convert(new Error('foo'), Number);
        }).should['throw'](_2['default'].Error);
      });
    });
  });

  describe('Date', function () {

    describe('Timestamp', function () {

      var converted = _2['default'].convert(Date.now(), Date);

      it('should be a number', function () {

        converted.should.be.an['instanceof'](Date);
      });
    });
  });

  describe('Array', function () {

    describe('of full models', function () {

      var converted = _2['default'].convert([new Bar({}, { _id: true })], [Bar]);

      console.log(converted);

      it('should be an Array', function () {

        converted.should.be.an.Array();
      });

      it('should be an Array of ObjectIDs', function () {

        converted[0].should.be.an['instanceof'](_2['default'].ObjectID);
      });
    });
  });
});