; ! function () {

  'use strict';

  module.exports = function itemsTemplate (items, panelView) {
    console.info('[items template]', items, panelView);

    var app = this;

    items.forEach(function (item) {
      app.controller('template')({
        name:       'item',
        url:        '/partial/item',
        container:  panelView.find('.items'),
        ready:      function (view) {
          view.find('.item-title').text(item.subject);
          view.find('.description').text(item.description);

          if ( ! item.references.length ) {
            view.find('.item-references').hide();
          }

          if ( item.image ) {

            var image = $('<img/>')

            image.addClass('img-responsive');
            image.attr('src', item.image);

            view.find('.item-media').append(image);
          }
        }
      });
    });
  };

} ();
