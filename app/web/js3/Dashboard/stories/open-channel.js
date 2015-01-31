! function () {

  'use strict';

  function openChannel (url) {
    var app = this;

    app.model('channelWindow',
      window.open(url || '/', 'channelWindow',
        'chrome=yes,width=770,height=956,left=500,centerscreen'));
  }

  module.exports = openChannel;

} ();
