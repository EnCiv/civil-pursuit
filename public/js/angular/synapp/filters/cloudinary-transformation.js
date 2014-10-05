/**
 * `cloudinaryTransformationFilter` ** Return cloudinary transformation **
 *  https://cloudinary.com/console/transformations
 * 
 *  @module filters/cloudinary-transform
 *  @example
 *    <!-- HTML -->
 *    <img ng-src='image | cloudinaryTransformationFilter' />
 *    
 *    // JS
 *    var img = cloudinaryTransformationFilter(image);
 * @author francoisrvespa@gmail.com
*/

module.exports = function cloudinaryTransformationFilter () {

  /** @method cloudinaryTransformation
   * @param cloudinaryImageUrl {?string}
   * @return {?string}
  */
  function cloudinaryTransformation (cloudinaryImageUrl) {
    if ( cloudinaryImageUrl && typeof cloudinaryImageUrl === 'string' ) {
      return cloudinaryImageUrl.replace(/\/image\/upload\/v(.+)\/(.+)\.jpg$/,
        '/image/upload/t_media_lib_thumb/$2.jpg');
    }
  }

  return cloudinaryTransformation;
};
