! function () {
  
  'use strict';

  var Synapp    =   require('../Synapp');
  var Item    =   require('../Item');
  var Sign      =   require('../Sign');
  var Intro     =   require('../Intro');
  var Panel     =   require('../Panel');

  window.app = new Synapp();

  app.ready(function onceAppConnects_HomePage () {

    /** Render user-related components */
    new Sign().render();

    /** Render intro */
    new Intro().render();

    var panel = new Panel('Topic');

    /** If page is about an item */
    if ( app.location.item ) {
      panel.template = $('#panel-Topic');

      panel.render(app.domain.intercept(function () {
        $('#panel-Topic .item[id]').each(function () {
          var id = $(this).attr('id').split('-')[1];

          var _item = {
            _id           :     id,
            subject       :     $(this).find('.item-subject').text(),
            description   :     $(this).find('.item-description').text(),
            image         :     $(this).find('.item-media img').attr('src'),
            references    :     [],
            views         :     +$(this).data('views'),
            promotions    :     +$(this).find('.promoted').text(),
            type          :     'Topic'
          };

          if ( $(this).find('.item-reference a').attr('url') !== '#' ) {
            _item.references[0] = { url: $(this).find('.item-reference a').attr('url') };
            _item.references[0].title = $(this).find('.item-reference a').data('title');
          }

          console.log('item', _item)

          var item = new Item(_item);

          item.template = $(this);

          item.render(app.domain.intercept(function (args) {
            // ...code  
          }));

        });
      }));
    }

    else {

      panel
        
        .load(app.domain.intercept(function onGotPanels (template) {

          $('.panels').append(template);

          setTimeout(function renderPanel_Pause () {
            panel.render(app.domain.intercept(function () {
              panel.fill();
            }));
          }, 700);

        }));
    }
  
  });

} ();
