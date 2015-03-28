! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toJSON () {
    var json = {
      type: this.type,
      size: this.size,
      skip: this.skip,
      // item: app.location.item
    };

    if ( this.parent ) {
      json.parent = this.parent;
    }

    return json;
  }

  module.exports = toJSON;

} ();
