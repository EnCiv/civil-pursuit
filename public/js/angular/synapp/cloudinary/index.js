/**
 * Synapp Angular module...
 * 
 * @module synapp
 * @author francoisrvespa@gmail.com
*/

;(function () {

  angular.module('synapp.cloudinary', [])

    .filter({
      cloudinaryTransformationFilter:   [require('./filters/cloudinary-transformation')]
    });
  
})();
