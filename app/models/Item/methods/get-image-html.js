! function () {
  
  'use strict';

  var config = require('syn/config');

  var cloudinary = require('syn/lib/util/cloudinary');

  function getImage () {

    var image = config.public['default item image'];

    if ( this.image && /cloudinary/.test(this.image) ) {
      image = this.image;
    }

    var chunks = image.split(/\//);

    var id = chunks.pop();
    var version = chunks.pop();

    var a = cloudinary.image(id, {
      height    :   135,
      width     :   240,
      crop      :   'thumb',
      gravity   :   'faces',
      version   :   version.replace(/^v/, '')
    });

    return a;
  }

  module.exports = getImage;

} ();
