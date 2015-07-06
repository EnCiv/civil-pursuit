'use strict';

!(function () {

  'use strict';

  var Nav = require('../../../lib/util/nav');
  var Item = require('../../../components/iten/ctrl');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save() {

    // Self reference

    var creator = this;

    app.emit('');

    // Hide the Creator

    Nav
    // Catch errors
    .hide(creator.template).error(app.domain.intercept)

    // Hiding complete

    .hidden(function () {
      // Build the JSON object to save to MongoDB

      var new_item = creator.packItem();

      // Adding user from global synapp

      new_item.user = app.socket.synuser;

      // In case a file was uploaded

      if (new_item.upload) {
        var file = creator.template.find('.preview-image').data('file');

        var stream = ss.createStream();

        ss(app.socket).emit('upload image', stream, { size: file.size, name: file.name });

        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          new_item.image = file.name;

          app.socket.emit('create item', new_item);
        });
      }

      // If nof ile was uploaded

      else {
        console.log('create item', new_item);

        app.socket.emit('create item', new_item);
      }

      app.socket.once('could not create item', app.domain.intercept());

      app.socket.once('created item', function (item) {

        console.log('created item', item);

        creator.panel.template.find('.create-new').hide();

        if (new_item.upload) {
          item.upload = new_item.upload;
        }

        if (new_item.youtube) {
          item.youtube = new_item.youtube;
        }

        var item = new Item(item);

        var items = creator.panel.find('items');

        item.load(app.domain.intercept(function () {
          items.prepend(item.template);
          item.render(app.domain.intercept(function () {
            item.find('toggle promote').click();
          }));
        }));
      });
    });
  }

  module.exports = save;
})();