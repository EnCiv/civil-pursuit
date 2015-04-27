! function () {
  
  'use strict';

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  INTRO VIEW
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  @module       views/Intro
  */

  var html5       =   require('syn/lib/html5');
  var PanelView   =   require('syn/views/Panel');
  var ItemView    =   require('syn/views/Item');

  module.exports  =   function IntroView (locals) {

    return html5.Element('#intro')

      .add(function IntroBox (locals) {

        var panel = PanelView({ creator: false });

        panel.find('.items')

          .each(function (itemsWrapper) {
            itemsWrapper.add(ItemView({ buttons: false }));
          });

        return panel;
      });

  };

} ();
