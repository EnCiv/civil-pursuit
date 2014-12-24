! function () {

  'use strict';

  module.exports = function bootstrapResponsiveImage (options) {
    console.info('[*]', "\tbootstr\*", 'responsive image', options);

    var img = $('<img/>');

    img.addClass('img-responsive');

    if ( options.src ) {
      img.attr('src', options.src);
    }

    return img;

  };

} ();
