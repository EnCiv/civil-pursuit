! function () {
  
  'use strict';

  var YouTube     =   require('syn/components/YouTube/Controller');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function itemMedia () {

    // youtube video from references

    if ( this.item.references && this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // adjustImage

    if ( this.item.adjustImage ) {

      console.info('adjustImage')

      return $(this.item.adjustImage
              .replace(/\>$/, ' class="img-responsive" />'));
    }

    // image

    if ( this.item.image && /^http/.test(this.item.image) ) {

      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    // YouTube Cover Image

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

    // Uploaded image

    if ( this.item.upload ) {
      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', this.item.upload);

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
