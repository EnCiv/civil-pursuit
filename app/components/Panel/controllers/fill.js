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

    console.log('getting panel items', panel);

    function gotPanelItems (_panel, items) {

      if ( self.constructor.getId(panel) !== self.constructor.getId(_panel) ) {
        return /** This is about another panel */;
      }

      console.log('got panel items', items)
    
      self.template.find('.hide.pre').removeClass('hide');
      self.template.find('.show.pre').removeClass('show').hide();

      self.template.find('.loading-items').hide();

      if ( items.length ) {

        self.find('create new').hide();
        self.find('load more').show();

        if ( items.length < synapp['navigator batch size'] ) {
          self.find('load more').hide();
        }

        self.skip += items.length;

        self.preInsertItem(items, cb);
      }

      else {
        self.find('create new').show();
        self.find('load more').hide();
      }

      app.socket.removeListener('OK get items', gotPanelItems);

    }

    app.socket.publish('get items', panel, gotPanelItems);

  }

  module.exports = fill;

} ();
