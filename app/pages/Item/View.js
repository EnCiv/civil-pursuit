! function () {
  
  'use strict';

  var PanelView   =   require('syn/views/Panel');
  var ItemView    =   require('syn/views/Item');

  function ItemViewPage (locals) {

    var Layout    =   require('syn/components/Layout/View')(locals);

    var panel     =   PanelView(locals);

    var item      =   ItemView(locals);

    panel
      .find('h4.panel-title')
      .each(function (title) {
        title.options.$text = locals.item.subject;
      });

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

  module.exports = ItemViewPage;

} ();
