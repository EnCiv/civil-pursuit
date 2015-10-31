'use strict';

import path         from 'path';
import cloudinary   from '../../../lib/app/cloudinary';
import config       from '../../../../secret.json';

function saveImage (item) {
  return new Promise((ok, ko) => {
    try {
      if ( ! item.image || new RegExp('^https?:').test(item.image) ) {
        return ok();
      }

      cloudinary.uploader.upload(

        path.join(config.tmp, item.image),

        result => {
          item
            .set('image', result.url)
            .save()
            .then(ok, ko);
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
    catch ( error ) {
      ko(error);
    }
  });
}

export default saveImage;
