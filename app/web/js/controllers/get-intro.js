; ! function () {

  'use strict';

  module.exports = function getIntro () {
    console.info('[get-intro]');
    this.controller('monson get')('/models/Item.findOne?type=Intro',
      function (error, intro) {
        if ( error ) {
          return this.emit('error', error);
        }

        this.model('intro', intro);

      }.bind(this));
  };

} ();
