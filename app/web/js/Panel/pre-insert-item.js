! function () {
  
  'use strict';

  var Item =require('../Item');

  function preInsertItem (items, cb) {
    var self = this;

    /** Load template */

    if ( ! app.cache.template.item ) {
      return new Item({}).load(app.domain.intercept(function (template) {
        self.preInsertItem(items, cb); 
      }));
    }

    /** Items to object */

    items = items.map(function (item) {
      console.log(item.subject)
      item = new Item(item);

      item.load(app.domain.intercept(function (template) {

        var img = template.find('.item-media img');
        var loading = $('<i class="fa fa-refresh fa-5x fa-spin center block-center muted"></i>');

        loading.insertAfter(img);

        img.remove();

        self.find('items').append(template); 
      }));

      return item;
    });



    // items = items.map(function (item) {

    //   item = new Item(item);

    //   item.load(app.domain.intercept(function (template) {}));

    //   return item;
    // });

    // var templates = items.map(function (item) {
    //   return item.template;
    // });

    // self.find('items').append(templates);

    // if ( items[i] ) {

    //   var item  = new Item(items[i]);

    //   console.log('inserting item 'tem)

    //   item.load(app.domain.intercept(function (template) {
    //     self.find('items').append(template);

    //     self.preInsertItem(items, ++ i, cb);

    //     // item.render(app.domain.intercept(function () {
    //     //   self.insertItem(items, ++ i, cb);
    //     // }));

    //   }));
    // }
    // else {
    //   cb && cb();
    // }
  }

  module.exports = preInsertItem;

} ();
