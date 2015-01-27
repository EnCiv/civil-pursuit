! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function placeItemInPanel (item, view, cb) {

    var div = this;
    var Panel = div.root.extension('Panel');

    var panelId = '#panel-' + item.type;

    if ( item.parent ) {
      panelId += '-' + item.parent;
    }

    console.warn('placing 2', item.subject, panelId)

    // In case of a new item
    
    if ( item.is_new ) {
      $(panelId).find('.items').prepend(view);

      // image if any

      var file = $('.creator.' + item.type)
        .find('.preview-image').data('file');

      if ( file ) {
        view.find('.item-media img').attr('src',
          (window.URL || window.webkitURL).createObjectURL(file));
      }

      // call promote

      view.find('.toggle-promote').click();
    }
    
    // Else, regular fetch

    else {
      $(panelId).find('> .panel-body > .items').append(view);
    }

    setTimeout(function () {
      Panel.controller('reveal')(view, null, function () {
        
        luigi('tpl-toggle-arrow')
          
          .controller(function (arrow) {
            arrow.insertAfter(view);
            cb();
          });

      });
    }, 800);
  }

  module.exports = placeItemInPanel;

} ();
