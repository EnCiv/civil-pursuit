! function () {
  
  'use strict';

  function fill (item, cb) {
    var self = this;

    if ( typeof item === 'function' && ! cb ) {
      cb = item;
      item = undefined;
    }

    var panel = self.toJSON();

    if ( item ) {
      panel.item = item;
      panel.type = undefined;
    }

    console.log('panel', panel)

    app.socket.publish('get items', panel, function (panel, items) {
      console.warn(panel, items)
    });

    // app.socket

    //   .once('got items ' + this.id, function (panel, items) {

    //     console.log('got items', panel, items)

    //     self.template.find('.hide.pre').removeClass('hide');
    //     self.template.find('.show.pre').removeClass('show').hide();

    //     self.template.find('.loading-items').hide();

    //     if ( items.length ) {

    //       self.find('create new').hide();
    //       self.find('load more').show();

    //       if ( items.length < synapp['navigator batch size'] ) {
    //         self.find('load more').hide();
    //       }

    //       self.skip += items.length;

    //       self.preInsertItem(items, cb);
    //     }

    //     else {
    //       self.find('create new').show();
    //       self.find('load more').hide();
    //     }

    //   })

    //   .emit('get itemsss', panel);
  }

  module.exports = fill;

} ();
