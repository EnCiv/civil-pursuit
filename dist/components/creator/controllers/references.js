'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _youtubeCtrl = require('../../youtube/ctrl');

var _youtubeCtrl2 = _interopRequireDefault(_youtubeCtrl);

function renderReferences(ref) {
  var self = this;

  // Get reference's title

  var findTitle = function findTitle() {

    var creator = $(this).closest('.' + ref).data(ref);

    var board = creator.find('reference board');
    var reference = $(this);

    board.removeClass('hide').text('Looking up title');

    var url = $(this).val();

    if (url) {
      self.getTitle(url).then(function (title) {
        if (title) {
          board.text(title).on('click', function () {
            reference.css('display', 'block');
            board.addClass('hide');
          });
          reference.data('title', title).css('display', 'none');

          var yt = (0, _youtubeCtrl2['default'])(url);

          if (yt) {
            creator.find('dropbox').hide();

            creator.find('item media').empty().append(yt);
          }
        } else {
          board.text('Looking up').addClass('hide');
        }
      });
    }
  };

  this.find('reference').on('blur change', findTitle).on('keydown', function (e) {
    if (e.keyCode === 9 || e.keyCode === 13) {
      findTitle.apply(this);
    }
  });
}

exports['default'] = renderReferences;
module.exports = exports['default'];