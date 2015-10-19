'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _publicJson = require('../../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

var _libUtilToSlug = require('../../../lib/util/to-slug');

var _libUtilToSlug2 = _interopRequireDefault(_libUtilToSlug);

function toPanelItem() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _this.populate().then(function () {
        try {
          (function () {
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            var _id = _this._id;
            var id = _this.id;
            var subject = _this.subject;
            var description = _this.description;
            var image = _this.image;
            var references = _this.references;
            var views = _this.views;
            var promotions /** Number **/
            = _this.promotions;

            var item = {
              _id: _id, /** ObjectID **/
              id: id, /** String **/
              subject: subject, /** String **/
              description: description, /** String **/
              image: image, /** String **/
              references: references, /** [{ title: String, url: String }] **/
              views: views, /** Number **/
              promotions: promotions /** Number **/
            };

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            item.image = item.image || _publicJson2['default']['default item image'];
            item.popularity = _this.getPopularity();
            item.link = '/item/' + id + '/' + (0, _libUtilToSlug2['default'])(subject);

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            Promise.all([_this.getLineage(), _this.__populated.type.getSubtype(), _this.countVotes(), _this.countChildren(), _this.countHarmony()]).then(function (results) {
              try {
                item.lineage = results[0];
                item.subtype = results[1];
                item.votes = results[2];
                item.children = results[3];
                item.harmony = results[4];

                item.type = _this.__populated.type;
                item.user = _this.__populated.user;

                ok(item);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      }, ko);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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