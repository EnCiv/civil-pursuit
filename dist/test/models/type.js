'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _modelsType = require('../../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

var TestTypeModel = (function () {
  function TestTypeModel() {
    _classCallCheck(this, TestTypeModel);
  }

  _createClass(TestTypeModel, null, [{
    key: 'main',
    value: function main() {
      return new Promise(function (ok, ko) {
        Promise.all([TestTypeModel.isHarmony()]).then(ok, ko);
      });
    }
  }, {
    key: 'isType',
    value: function isType(type) {
      return new Promise(function (ok, ko) {
        try {
          type.should.be.an.Object;

          // _id

          type.should.have.property('_id');

          type._id.constructor.name.should.be.exactly('ObjectID');

          // name

          type.should.have.property('name');

          type.name.should.be.a.String;

          // harmony

          type.should.have.property('harmony');

          type.harmony.should.be.an.Array;

          // parent

          if (type.parent) {
            type.should.have.property('parent');

            type.parent.constructor.name.should.be.exactly('ObjectID');
          }

          ok();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'isHarmony',
    value: function isHarmony() {
      return new Promise(function (ok, ko) {

        _modelsType2['default'].findOneRandom(function (error, type) {
          if (error) {
            return ko(error);
          }

          TestTypeModel.isType(type).then(function () {
            try {
              type.isHarmony().then(function (isHarmony) {
                try {
                  isHarmony.should.be.a.Boolean;
                  console.log(type.name + ' is harmony?', isHarmony);
                  ok();
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        });
      });
    }
  }]);

  return TestTypeModel;
})();

exports['default'] = TestTypeModel;
module.exports = exports['default'];