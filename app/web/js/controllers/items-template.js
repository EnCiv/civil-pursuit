; ! function () {

  'use strict';

  module.exports = function itemsTemplate (items, panelView) {
    console.info('[items template]', items, panelView);

    var app = this;

    items.forEach(function (item) {
      app.controller('template')({
        name:       'item',
        url:        '/partial/item',
        container:  panelView,
        ready:      function (view) {
          view.find('h1').text(item.subject);
        }
      });
    });
  };

} ();
