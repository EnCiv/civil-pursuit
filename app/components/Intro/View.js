! function () {
  
  'use strict';

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  INTRO VIEW
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  @module       views/Intro
  */

  var html5       =   require('syn/lib/html5');
  var PanelView   =   require('syn/components/Panel/View');
  var ItemView    =   require('syn/components/Item/View');

  module.exports  =   function IntroView (locals) {

    return html5.Element('#intro')

      .add(function IntroBox (locals) {

        var panel = PanelView({ creator: false });

        panel.find('.items')

          .each(function (itemsWrapper) {
            itemsWrapper.add(ItemView({ item: {
              buttons: false, collapsers: false
            } }));
          });

        return panel;
        
      });

  };

} ();
