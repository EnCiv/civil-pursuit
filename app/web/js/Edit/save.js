! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {
        
        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error)
        });
        
        app.socket.once('created item', function (item) {
          console.log('created item', item);

            if ( new_item.upload ) {
              item.upload = new_item.upload;
            }

            if ( new_item.youtube ) {
              item.youtube = new_item.youtube;
            }

            var item  = new (require('../Item'))(item);

            item.load(app.domain.intercept(function () {
              item.template.insertBefore(edit.item.template);
              
              item.render(app.domain.intercept(function () {
                item.find('toggle promote').click();
              }));
            }));
        });
      }));
    }));
  }

  module.exports = save;

} ();
