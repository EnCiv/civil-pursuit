'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _modelsItem = require('../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var TestItemModel = (function () {
  function TestItemModel() {
    _classCallCheck(this, TestItemModel);
  }

  _createClass(TestItemModel, null, [{
    key: 'main',
    value: function main() {
      return new Promise(function (ok, ko) {
        Promise.all([TestItemModel.disposable(), TestItemModel.toPanelItem(), TestItemModel.evaluate()]).then(ok, ko);
      });
    }
  }, {
    key: 'isItem',
    value: function isItem(item) {
      return new Promise(function (ok, ko) {
        try {
          item.should.be.an.Object;

          // _id

          item.should.have.property('_id');

          item._id.constructor.name.should.be.exactly('ObjectID');

          // user

          item.should.have.property('user');

          item.user.constructor.name.should.be.exactly('ObjectID');

          // type

          item.should.have.property('type');

          item.type.constructor.name.should.be.exactly('ObjectID');

          // parent

          if (item.parent) {
            item.should.have.property('parent');

            item.parent.constructor.name.should.be.exactly('ObjectID');
          }

          // image

          if (item.image) {
            item.should.have.property('image');

            item.image.should.be.a.String;
          }

          // id

          item.should.have.property('id').which.is.a.String;

          // description

          item.should.have.property('description').which.is.a.String;

          // subject

          item.should.have.property('subject').which.is.a.String;

          // views

          item.should.have.property('views').which.is.a.Number;

          // promotions

          item.should.have.property('promotions').which.is.a.Number;

          // references

          item.should.have.property('references').which.is.an.Array;

          if (item.references.length) {
            item.references[0].should.be.an.Object;

            item.references[0].should.have.property('url').which.is.a.String;

            if (item.references[0].title) {
              item.references[0].should.have.property('title').which.is.a.String;
            }
          }

          ok();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'disposable',
    value: function disposable() {
      return new Promise(function (ok, ko) {
        try {
          (function () {
            var state = null;

            setTimeout(function () {
              if (state === null) {
                ko(new Error('Script timed out: disposable'));
              }
            }, 2500);

            _modelsItem2['default'].disposable().then(function (item) {
              try {
                state = true;
                ok(item);
              } catch (error) {
                state = false;
                ko(error);
              }
            }, function (error) {
              state = false;
              ko(error);
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'toPanelItem',
    value: function toPanelItem() {
      return new Promise(function (ok, ko) {

        var state = null;

        setTimeout(function () {
          if (state === null) {
            ko(new Error('Script timed out: toPanelItem'));
          }
        }, 2500);

        _modelsItem2['default'].disposable().then(function (item) {
          try {
            TestItemModel.isItem(item).then(function () {
              try {
                item.should.have.property('toPanelItem').which.is.a.Function;

                item.toPanelItem().then(function () {
                  try {
                    state = true;
                    ok();
                  } catch (error) {
                    state = false;
                    ko(error);
                  }
                }, function (error) {
                  state = false;
                  ko(error);
                });
              } catch (error) {
                state = false;
                ko(error);
              }
            }, function (error) {
              state = false;
              ko(error);
            });
          } catch (error) {
            ko(error);
          }
        }, function (error) {
          state = false;
          ko(error);
        });
      });
    }
  }, {
    key: 'evaluate',
    value: function evaluate() {
      return new Promise(function (ok, ko) {
        _modelsItem2['default'].disposable().then(function (item) {
          _modelsItem2['default'].evaluate(item.user, item._id).then(function (evaluation) {
            // console.log('Evaluation', evaluation);
            ok();
          }, ko);
        }, ko);
      });
    }
  }]);

  return TestItemModel;
})();

exports['default'] = TestItemModel;
module.exports = exports['default'];