; ! function () {

  'use strict';

  function itemMedia (item) {

    var app = this;

    var media;

    // youtube video from references

    if ( item.references.length ) {
      media = app.controller('youtube')(item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( item.image ) {
      return app.controller('bootstrap/responsive-image')({
        src: item.image
      });
    }
  }

  module.exports = itemMedia;

} ();
