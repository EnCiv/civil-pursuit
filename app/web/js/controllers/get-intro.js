; ! function () {

  'use strict';

  module.exports = function template (template) {
    this.controller('monson GET')('/models/Item.findOne?type=Intro',
      function (error, intro) {
        if ( error ) {
          return this.emit('error', error);
        }

        console.log('view of intro', this.view('intro'))

        require('./apply-template-to-panel')(this.view('intro'), {
          type: intro.subject
        });

      }.bind(this));
  };

} ();
