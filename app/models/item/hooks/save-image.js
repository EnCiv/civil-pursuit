'use strict';

import path         from 'path';
import cloudinary   from 'cloudinary';
import Config       from '../../../../public.json';

function saveImage (item) {
  return new Promise((ok, ko) => {
    try {
      if ( ! item.image || new RegExp('^https?:').test(item.image) ) {
        return ok();
      }

      cloudinary.uploader.upload(

        path.join(Config.tmp, item.image),

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
              crop          :   'thumb'
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
