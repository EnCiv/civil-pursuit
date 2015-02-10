! function () {
  
  'use strict';

  var YouTube     =   require('../YouTube');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function itemMedia () {

    console.log('getting item media of', this.item)

    // youtube video from references

    if ( this.item.references && this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( this.item.image ) {

      var src = this.item.image;

      if ( ! /^http/.test(this.item.image) ) {
        src = synapp['default item image'];
      }

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

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
