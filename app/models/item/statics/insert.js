'use strict';

import path         from 'path';
import cloudinary   from '../../../lib/app/cloudinary';
import config       from '../../../../secret.json';

function insertItem (candidate, socket) {
  console.log('--insert item', candidate, "\n\n")

  return new Promise((ok, ko) => {
    let { image } = candidate;

    console.log('--image', image, "\n\n")

    if ( candidate.image ) {
      delete candidate.image;
    }

    this.create(candidate)
      .then(
        (item, a, b, c) => {
          console.log('--created', item, a, b, c, "\n\n")

          ok(item);

          if ( image ) {
            console.log('--uploading image to cloudinary', item, "\n\n")
            cloudinary.uploader.upload(

              path.join(config.tmp, image),

              result => {
                console.log('--got response from cloudinary', result, "\n\n")

                item.image = result.url;
                item.save(error => {
                  if ( error ) {
                    return ko(error);
                  }
                  item
                    .toPanelItem()
                    .then(
                      item => socket.emit('item image uploaded ' + item._id, item),
                      error => socket.error(error)
                    );
                });
              },

              {
                transformation : [
                  {
                    width         :   240,
                    height        :   135,
                    crop          :   'thumb',
                    gravity       :   'face'
                  }
                ]
              }
            );
          }

        },
        ko
      );
  });
}

export default insertItem;
