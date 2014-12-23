; ! function () {

  'use strict';

  module.exports = function template (template) {
    this.controller('monson GET')('/models/Item.findOne?type=Intro',
      function (error, intro) {
        if ( error ) {
          return this.emit('error', error);
        }

        
      }.bind(this));
  };

} ();
