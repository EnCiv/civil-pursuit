'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var Foo1 = (function (_Mung$Model) {
  function Foo1() {
    _classCallCheck(this, Foo1);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Foo1, _Mung$Model);

  _createClass(Foo1, null, [{
    key: 'schema',
    value: function schema() {
      return {
        string: {
          'default': 'hello'
        },
        number: {
          'default': 0
        },
        date: {
          'default': Date.now
        },
        mixed: {
          type: [_2['default'].Mixed],
          'default': []
        },
        array: [{
          foo: {
            type: String,
            'default': 'hello'
          }
        }],
        subdocument: {
          type: {
            foo: {
              type: String,
              'default': 'hello'
            },
            bar: {
              type: {
                barz: {
                  type: Number,
                  'default': 1
                }
              }
            }
          }
        }
      };
    }
  }]);

  return Foo1;
})(_2['default'].Model);

describe('Prepare', function () {

  describe('Prepare empty query', function () {

    var document = new Foo1({});

    it('should prepare document for insertion', function (done) {

      document.prepare('insert').then(function () {
        return done();
      }, done);
    });

    describe('Document', function () {

      it('should have a string property', function () {

        document.should.have.property('string');
      });

      describe('string', function () {

        it('should say hello', function () {

          document.string.should.be.exactly('hello');
        });
      });
    });
  });
});