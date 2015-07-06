'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsYoutubeView = require('../../../components/youtube/view');

var _componentsYoutubeView2 = _interopRequireDefault(_componentsYoutubeView);

function MediaController() {
  var _this = this;

  var item = this.get('item');

  var references = item.references || [];

  // YouTube

  if (references.length) {

    var youtube = new _componentsYoutubeView2['default']({
      settings: { env: synapp.props.settings.env },
      item: item
    });

    if (youtube.children.length) {
      var _YouTube$resolve = _componentsYoutubeView2['default'].resolve(youtube.children[0].selector);

      var element = _YouTube$resolve.element;

      if (element === 'iframe') {
        return $(youtube.render());
      }
    }
  }

  // adjustImage

  if (item.adjustImage) {
    return $(item.adjustImage.replace(/\>$/, ' class="img-responsive" />'));
  }

  // Item has image

  if (item.image && /^http/.test(item.image)) {
    var _ret = (function () {
      var src = item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', synapp.config['default item image']);

      _this.publish('format cloudinary image', src, item._id.toString()).subscribe(function (pubsub, img, _id) {
        if (_id === item._id.toString()) {
          image.attr('src', img);
          pubsub.unsubscribe();
        }
      });

      return {
        v: image
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }

  // YouTube Cover Image

  if (item.youtube) {
    return $(new _componentsYoutubeView2['default']({
      item: {
        references: [{
          url: 'http://youtube.com/watch?v=' + item.youtube
        }]
      },
      settings: { env: synapp.props.settings.env }
    }).render());
  }

  // Uploaded image

  // if ( item.upload ) {
  //   var src = item.image;

  //   var image = $('<img/>');

  //   image.addClass('img-responsive');

  //   image.attr('src', item.upload);

  //   return image;
  // }

  // default image

  var image = $('<img/>');

  image.addClass('img-responsive');

  image.attr('src', synapp.config['default item image']);

  return image;
}

exports['default'] = MediaController;
module.exports = exports['default'];