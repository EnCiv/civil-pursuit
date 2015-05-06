! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');
  var Page                =   require('syn/lib/Page');
  var ItemDefaultButtons  =   require('syn/views/ItemDefaultButtons');
  var Promote             =   require('syn/views/Promote');

  module.exports          =   function ItemView (viewOptions) {
    viewOptions           =   viewOptions || {};

    var itemAttribute     =   {
      id                  :   viewOptions.id
    };

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item media
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var ItemWrapper       =     html5.Element('.item-media-wrapper')

      .add(
        html5.Element('.item-media', {}, function itemMediaImage () {

          if ( viewOptions.item && viewOptions.item.image ) {
            return html5.Element('img.img-responsive', { src: viewOptions.item.image });
          }

          else if ( viewOptions.media ) {
            return viewOptions.media;
          }

          return [];

        })
      );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item buttons
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var ItemButtons = html5.Element('.item-buttons', {
        $condition : function () {
          return viewOptions.buttons !== false;
        }
      }
    );

    if ( viewOptions.buttons ) {
      ItemButtons.add(viewOptions.buttons);
    }

    else {
      ItemButtons.add(ItemDefaultButtons());
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item text
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var ItemText = html5.Element('.item-text', {}, [

      html5.Element('.item-truncatable', {}, [

        html5.Element('h4.item-subject.header', {}, [

          html5.Element('a', {
            href    :   function (locals) {
              if ( locals && locals.item ) {
                return Page('Item Page', locals.item);
              }

              return '#';
            },
            $text   :   function (locals) {
              if ( locals && locals.item ) {
                return locals.item.subject;
              }
              return '';
            }
          })

        ]),

        html5.Element('.item-description.pre-text', {
          $text: function (locals) {
            if ( locals && locals.item ) {
              return locals.item.description;
            }
            return '';
          }
        })

      ])

    ]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Item collapsers
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var ItemCollapsers = html5.Element('.item-collapsers');

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // PROMOTE
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ItemCollapsers.add(
      html5.Element('.promote.is-container').add(
        html5.Element('.is-section').add(Promote(viewOptions))
      )
    );

    return html5.Element('.item', itemAttribute)

      .add(
        ItemWrapper,
        ItemButtons,
        ItemText,
        ItemCollapsers,
        html5.Element('.clear')
      );

  };

} ();
