! function () {
  
  'use strict';

  var Synapp    =   require('syn/js/Synapp');
  var Sign      =   require('syn/js/components/Sign');
  var Intro     =   require('syn/js/components/Intro');
  var Panel     =   require('syn/js/components/Panel');

  window.app    =   new Synapp();

  app.ready(function () {
    /** Render intro */
    new Intro().render();

    console.log('hello!');

    /** Render user-related components */
    new Sign().render();

    var $panel = $('.panel[id]:last');
    var type = $panel.attr('id').split('-')[1];

    console.log('static type', type)

    var panel = new Panel(type);

    panel.template = $('.panel[id]:last');

    panel.render(app.domain.intercept(function () {
      panel.template.find('.item[id]').each(function () {
        var id = $(this).attr('id').split('-')[1];

        var _item = {
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

        var item = new Item(_item);

        item.template = $(this);

        item.render(app.domain.intercept(function onItemRendered (args) {
          // ...code  
        }));

      });
    }));

  });

} ();
