! function () {
  
  'use strict';

  var cloudinary = require('cloudinary');

  var config = require('syn/config.json');

  cloudinary.config({ 
    cloud_name      :   config.cloudinary.cloud.name, 
    api_key         :   config.cloudinary.API.key, 
    api_secret      :   config.cloudinary.API.secret 
  });

  module.exports = cloudinary;

} ();
