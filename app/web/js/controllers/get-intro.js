; ! function () {

  'use strict';

  module.exports = function template (template) {
    this.controller('monson get')('/models/Item.findOne?type=Intro',
      function (error, intro) {
        if ( error ) {
          return this.emit('error', error);
        }

        this.model('intro', intro);

      }.bind(this));
  };

} ();
