! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');
  var ItemDefaultButtons  =   require('syn/views/ItemDefaultButtons');

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

    }

    else {
      ItemButtons.add(ItemDefaultButtons());
    }

    var ItemText = html5.Element('.item-text', {}, [

      html5.Element('.item-truncatable', {}, [

        html5.Element('h4.item-subject.header', {}, [

          html5.Element('a', { href: '#' })

        ]),

        html5.Element('.item-description.pre-text')

      ])

    ]);

    return html5.Element('.item', itemAttribute)

      .add(
        ItemWrapper,
        ItemButtons,
        ItemText,
        html5.Element('.clear')
      );

  };

} ();
