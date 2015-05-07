! function () {
  
  'use strict';

  var Nav       =   require('syn/js/providers/Nav');
  var Item      =   require('syn/js/components/Item');
  var Stream    =   require('syn/js/providers/Stream');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {

    // Self reference

    var creator = this;

    process.nextTick(function () {

      app.domain.run(function () {

        // Hide the Creator           // Catch errors

        Nav.hide(creator.template)    .error(app.domain.intercept())

          // Hiding complete

          .hidden(function () {
            
            // Build the JSON object to save to MongoDB

            creator.packItem();

            // In case a file was uploaded

            if ( creator.packaged.upload ) {

              // Get file from template's data

              var file = creator.template.find('.preview-image').data('file');

              // New stream         //  Catch stream errors

              new Stream(file)      .on('error', app.domain.intercept(function () {}))

                .on('end', function () {
                  creator.packaged.image = file.name;

                  console.log('create item', creator.packaged);

                  app.socket.emit('create item', creator.packaged);
                })
            }

            // If nof ile was uploaded

            else {
              console.log('create item', creator.packaged);

              app.socket.emit('create item', creator.packaged);
            }

            // Listen to answers

            app.socket.once('could not create item', app.domain.intercept());

            app.socket.on('create item ok', creator.created.bind(creator));
          })

      });

    });

    return false;
  }

  module.exports = save;

} ();
