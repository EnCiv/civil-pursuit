! function Page_Item_Controller () {
  
  'use strict';

  var Synapp            =     require('syn/app');
  var SignComponent     =     require('syn/components/Sign/Controller');
  var PanelComponent    =     require('syn/components/Panel/Controller');

  window.app            =     new Synapp();

  app.ready(function () {

    /** Render user-related components */
    new SignComponent().render();

    var $panel          =     $('.panel[id]:last');
    var type            =     $panel.attr('id').split('-')[1];

    console.log('static type', type, $panel.attr('id'))

    var panel           =     new PanelComponent(type);

    panel.template      =     $('.panel[id]:last');

    panel.render(app.domain.intercept(function () {
      panel.template.find('.item[id]').each(function () {
        var id          =     $(this).attr('id').split('-')[1];

        var _item       =     {
          _id           :     id,
          type          :     type,
          subject       :     $(this).find('.item-subject').text(),
          description   :     $(this).find('.item-description').text(),
          image         :     $(this).find('.item-media img').data('image'),
          references    :     [],
          views         :     +$(this).data('views'),
          promotions    :     +$(this).find('.promoted').text(),
          related       :     {
            Problem     :     +$(this).find('.related-count').text()
          }
        };

        console.log('tYPE', panel.template.attr('id').split('-')[1])

        if ( $(this).find('.item-reference a').attr('url') !== '#' ) {
          _item.references[0] = { url: $(this).find('.item-reference a').attr('url') };
          _item.references[0].title = $(this).find('.item-reference a').data('title');
        }

        var item        =     new Item(_item);

        item.template   =     $(this);

        item.render(app.domain.intercept(function onItemRendered (args) {
          // ...code  
        }));

      });
    }));

  });

} ();
