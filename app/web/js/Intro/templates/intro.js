! function () {

  'use strict';

  module.exports = {
    template: '#intro',
    controller: function (view, intro) {
      var app = this;
      var Item = app.importer.extension('Item');

      $('#intro').find('.panel-title').text(intro.subject);
      $('#intro').find('.item-title').text(intro.subject);
      $('#intro').find('.description').eq(0).text(intro.description);

      $('#intro').find('.item-media').empty().append(
        app.importer.controller('bootstrap/responsive-image')({
          src: intro.image
        }));

      $('#intro').find('.item-references').hide();

      new (Item.controller('truncate'))($('#intro'));

      $('#intro').find('.promoted').hide();

      $('#intro').find('.box-buttons').hide();

      $('#intro').find('.toggle-arrow').hide();
    }
  };

} ();
