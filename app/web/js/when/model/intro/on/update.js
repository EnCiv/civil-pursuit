! function () {

  'use strict';

  module.exports = function onUpdateModelIntro (intro) {
    var app = this;

    this.view('intro').find('.panel-title').text(intro.new.subject);

    this.view('intro').find('.item-title').text(intro.new.subject);

    this.view('intro').find('.description').text(intro.new.description);

    this.view('intro').find('.item-media').append(
      this.controller('bootstrap/responsive-image')({
        src: intro.new.image
      }));

    this.view('intro').find('.item-references').hide();
    
  };

} ();
