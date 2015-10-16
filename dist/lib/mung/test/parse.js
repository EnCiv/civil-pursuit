'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Foo = (function (_Mung$Model) {
  function Foo() {
    _classCallCheck(this, Foo);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Foo, _Mung$Model);

  _createClass(Foo, null, [{
    key: 'schema',
    value: function schema() {
      return {
        string: String,

        subdocument: {
          type: {
            string: String
          }
        },

        subdocumentInArray: [{
          string: String
        }]
      };
    }
  }]);

  return Foo;
})(_2['default'].Model);

;

var schema = new Foo().__types;

describe('Parsers', function () {

  describe('Parse empty query', function () {

    var parsed = _2['default'].parse({}, schema);

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });
  });

  describe('Parse id', function () {

    var parsed = _2['default'].parse({ _id: _2['default'].ObjectID() }, schema);

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });

    it('should have property _id', function () {

      parsed.should.have.property('_id');
    });

    describe('_id', function () {

      it('should be an ObjctID', function () {

        parsed._id.should.be.an['instanceof'](_2['default'].ObjectID);
      });
    });
  });

  describe('Parse model version', function () {

    var parsed = _2['default'].parse({ __V: 2 }, schema);

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });

    it('should have property __V', function () {

      parsed.should.have.property('__V');
    });

    describe('__V', function () {

      it('should be a number', function () {

        parsed.__V.should.be.a.Number();
      });
    });
  });

  describe('Parse string', function () {

    var parsed = _2['default'].parse({ string: 'foo' }, schema);

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });

    it('should have property string', function () {

      parsed.should.have.property('string');
    });

    describe('string', function () {

      it('should be a string', function () {

        parsed.string.should.be.a.String();
      });
    });
  });

  describe('Parse array of subdocuments', function () {

    var parsed = _2['default'].parse({ 'subdocumentInArray.string': 'foo is foo' }, schema);

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });

    it('should have property "subdocumentInArray.string"', function () {

      parsed.should.have.property('subdocumentInArray.string');
    });

    describe('subdocumentInArray.string', function () {

      it('should be a string', function () {

        parsed['subdocumentInArray.string'].should.be.a.String();
      });
    });
  });

  describe('Parse array meaning or', function () {

    var parsed = _2['default'].parse([{ number: 1 }, { number: 2 }], { number: Number });

    it('should be an object', function () {

      parsed.should.be.an.Object();
    });

    it('should have property "$or"', function () {

      parsed.should.have.property('$or');
    });

    describe('$or', function () {

      it('should be an array', function () {

        parsed.$or.should.be.an.Array();
      });

      describe('Array', function () {

        it('should have 2 items', function () {

          parsed.$or.should.have.length(2);
        });

        describe('1st item', function () {

          it('should be an object', function () {

            parsed.$or[0].should.be.an.Object();
          });

          describe('Object', function () {

            it('should have property number', function () {

              parsed.$or[0].should.have.property('number');
            });

            describe('Number', function () {

              it('should be 1', function () {

                parsed.$or[0].number.should.be.exactly(1);
              });
            });
          });
        });

        describe('2nd item', function () {

          it('should be an object', function () {

            parsed.$or[1].should.be.an.Object();
          });

          describe('Object', function () {

            it('should have property number', function () {

              parsed.$or[1].should.have.property('number');
            });

            describe('Number', function () {

              it('should be 2', function () {

                parsed.$or[1].number.should.be.exactly(2);
              });
            });
          });
        });
      });
    });
  });

  describe('Parse array with or', function () {

    var parsed = _2['default'].parse([{ string: 'a', numbers: 2 }], {
      string: String,
      numbers: [Number]
    });

    console.log(require('util').inspect(parsed, { depth: null }));
  });
});