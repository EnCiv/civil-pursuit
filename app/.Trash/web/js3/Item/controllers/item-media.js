; ! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function itemMedia (item) {

    var div = this;

    // youtube video from references

    if ( item.references.length ) {
      var media = div.controller('youtube')(item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( item.image ) {

      var src = item.image;

      if ( ! /^http/.test(item.image) ) {
        src = synapp['default item image'];
      }

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    // default image

    var image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', synapp['default item image']);

    return image;

  }

  module.exports = itemMedia;

} ();
