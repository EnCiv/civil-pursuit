! function () {

  'use strict';

  function progressBar ($details, item) {
    // promoted bar

    $details.find('.progress-bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');
  }

  module.exports = progressBar;

} ();
