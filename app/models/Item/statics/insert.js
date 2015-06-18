'use strict';

import path from 'path';
import cloudinary from 'syn/lib/util/cloudinary';
import config from 'syn/config.json';

function insertItem (candidate, socket) {
  console.log('insert item', candidate, socket, this.create)

  return new Promise((ok, ko) => {
    let { image } = candidate;

    if ( candidate.image ) {
      delete candidate.image;
    }

    this.create(candidate, (error, item) => {
      if ( error ) {
        return ko(error);
      }

      console.log('created', item)
      
      ok(item);

      if ( image ) {
        cloudinary.uploader.upload(
          
          path.join(config.tmp, image),
          
          result => {
            item.image = result.url;
            item.save(error => {
              if ( error ) {
                return ko(error);
              }
              item.toPanelItem((error, item) => {
                if ( error ) {
                  return ko(error);
                }
                socket.emit('item changed ' + item._id, item);
              });
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

    });
  });
}

export default insertItem;
