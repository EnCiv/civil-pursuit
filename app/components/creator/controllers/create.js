'use strict';

import Nav       from '../../../lib/util/nav';
import Item      from '../../../components/item/ctrl';
import Stream    from '../../../lib/app/Stream';

function save () {

  let d = this.domain;

  process.nextTick(() => {

    d.run(() => {

      console.info('NEW ITEM')

      // Hide the Creator           // Catch errors

      Nav.hide(this.template).error(d.intercept())

        // Hiding complete

        .hidden(() => {
          
          // Build the JSON object to save to MongoDB

          this.packItem();

          // In case a file was uploaded

          if ( this.packaged.upload ) {

            // Get file from template's data

            var file = this.template.find('.preview-image').data('file');

            // New stream         //  Catch stream errors

            new Stream(file)

              .on('error', d.intercept(() => {}))

              .on('end', () => {
                this.packaged.image = file.name;

                console.log('create item', this.packaged);

                this.publish('create item', this.packaged)
                  .subscribe((pubsub, item) => {
                    pubsub.unsubscribe();
                    this.created(item);
                  });
              })
          }

          // If nof ile was uploaded

          else {
            console.log('create item', this.packaged);

            this.publish('create item', this.packaged)
              .subscribe((pubsub, item) => {
                console.log('item created', item)
                pubsub.unsubscribe();
                this.created(item);
              });
          }
        })

    });

  });

  return false;
}

export default save;
