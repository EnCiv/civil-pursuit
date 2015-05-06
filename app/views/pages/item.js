! function () {
  
  'use strict';

  var Panel   =   require('syn/views/Panel');
  var Item    =   require('syn/views/Item');

  function ItemPage (locals) {

    var Layout = require('syn/views/Layout')(locals);

    var panel = Panel();

    panel
      .find('h4.panel-title')
      .each(function (title) {
        title.options.$text = locals.item.subject;
      });

    var item = Item(locals);

    panel
      .find('.items')
      .each(function (body) {
        body.add(item);
      });

    Layout.find('#main')

      .each(function (main) {

        main.add(
          panel
        );

      });

    return Layout;
  }

  module.exports = ItemPage;

} ();
