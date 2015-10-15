'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _publicJson = require('../../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var _libUtilToSlug = require('../../../lib/util/to-slug');

var _libUtilToSlug2 = _interopRequireDefault(_libUtilToSlug);

var _type = require('../../type');

var _type2 = _interopRequireDefault(_type);

var _user = require('../../user');

var _user2 = _interopRequireDefault(_user);

var _vote = require('../../vote');

var _vote2 = _interopRequireDefault(_vote);

function toPanelItem() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var Item = _this.constructor;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var _id = _this._id;
        var id = _this.id;
        var subject = _this.subject;
        var description = _this.description;
        var image = _this.image;
        var references = _this.references;
        var views = _this.views;
        var promotions /** Number **/
        = _this.promotions;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var item = {
          _id: _id,
          id: id,
          subject: subject,
          description: description,
          image: image,
          references: references,
          views: views,
          promotions: promotions
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        item.image = item.image || _publicJson2['default']['default item image'];
        item.popularity = _this.getPopularity();
        item.link = '/item/' + id + '/' + (0, _libUtilToSlug2['default'])(subject);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var getType = function getType() {
          return new Promise(function (ok, ko) {
            try {
              _type2['default'].findById(_this.type, { populate: 'harmony' }).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var getUser = function getUser() {
          return new Promise(function (ok, ko) {
            try {
              _user2['default'].findById(_this.user).then(function (user) {
                try {
                  if (!user) {
                    throw new Error('User not found: ' + _this.user);
                  }
                  var gps = user.gps;
                  var _id2 = user._id;

                  ok({ 'full name': user.fullName, gps: gps, _id: _id2 });
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var getSubtype = function getSubtype() {
          return new Promise(function (ok, ko) {
            try {
              _type2['default'].find({ parent: _this.type }).then(function (types) {
                try {
                  if (!types.length) {
                    return ok(null);
                  }
                  var promises = types.map(function (type) {
                    return type.isHarmony();
                  });
                  Promise.all(promises).then(function (results) {
                    try {
                      var subtype = results.reduce(function (subtype, isHarmony, index) {
                        if (!isHarmony) {
                          subtype = types[index];
                        }
                        return subtype;
                      }, null);

                      ok(subtype);
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var countChildren = function countChildren() {
          return new Promise(function (ok, ko) {
            try {
              Item.count({ parent: _this }).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var countVotes = function countVotes() {
          return new Promise(function (ok, ko) {
            try {
              _vote2['default'].count({ item: item }).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        Promise.all([_this.getLineage(), getType(), getUser(), getSubtype(), countVotes(), countChildren(), _this.countHarmony()]).then(function (results) {
          try {
            item.lineage = results[0];
            item.type = results[1];
            item.user = results[2];
            item.subtype = results[3];
            item.votes = results[4];
            item.children = results[5];
            item.harmony = results[6];

            ok(item);
          } catch (error) {
            ko(error);
          }
        }, ko);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = toPanelItem;
module.exports = exports['default'];
/** ObjectID **/
/** String **/
/** String **/
/** String **/
/** String **/
/** [{ title: String, url: String }] **/
/** Number **/